<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\DTOs\Teams\StoreTeamDTO;
use App\DTOs\Transactions\StoreTransactionDTO;
use App\Enums\CompetitionType;
use App\Enums\TransactionStatus;
use App\Http\Requests\Guest\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use App\Resources\Competitions\ShowCompetitionResource;
use App\Services\Competitions\CompetitionService;
use App\Services\FileService;
use App\Services\Teams\TeamService;
use App\Services\Transactions\TransactionService;
use Illuminate\Support\Facades\DB;

class CompetitionRegistrationController extends Controller
{
    public function __construct(
        protected CompetitionService $competitionService,
        protected TeamService $teamService,
        protected TransactionService $transactionService,
        protected FileService $fileService,
    ) {}

    /**
     * Display a listing of the resource.
     */

    // TODO: Call service/eloquent. 
    // TODO: Use another resource collection.
    public function index()
    {
        $query = Competition::query()->with('timelines');
        $competitions = $query->orderByDesc('updated_at')->paginate(5);

        return $this->render('guest/competitions/index', [
            'competitions' => ShowCompetitionResource::collection($competitions),
        ]);
    }

    /**
     * Show the form for registering a resource.
     */
    public function register()
    {
        return $this->render('guest/competitions/register', [
            'competitionMap' => $this->competitionService->getCompetitionMap(),
        ]);
    }

    /**
     * Store a newly registered resource in storage.
     */
    public function store(RegisterCompetitionRequest $request)
    {
        $validated = $request->validated();

        $competition = Competition::query()->findOrFail($validated['competition_id']);

        DB::transaction(function () use ($request, $validated, $competition) {
            $teamName = $competition->type === CompetitionType::solo->value
                ? $request->user()->name
                : trim($validated['team_name']);

            $team = $this->teamService->create(new StoreTeamDTO(
                competition_id: $competition->id,
                team_name: $teamName,
                leader_id: $request->user()->id,
                phone_number: $validated['phone_number'],
            ));

            if ($competition->type === CompetitionType::team->value) {
                foreach ($validated['members'] as $member) {
                    $team->members()->create([
                        'member_name' => $member['member_name'],
                    ]);
                }
            }

            $this->transactionService->create(new StoreTransactionDTO(
                team_id: $team->id,
                amount: $competition->price,
                payment_method: $validated['payment_method'],
                payment_proof_file: $validated['payment_proof_file'],
                status: TransactionStatus::pending->value,
            ));
        });

        $this->flash('success', 'Competition registration submitted successfully.');
        $this->flash('success', 'Please kindly wait for the verification of your transaction. Thank you!');

        return redirect()->route('competitions.index');
    }

    /**
     * Display the specified resource.
     */
    // TODO: Use another resource.
    // TODO: Dont use new resource, use collection or something else.
    public function show(Competition $competition)
    {
        $competition->load('timelines');

        return $this->render('guest/competitions/show', [
            'competition' => new ShowCompetitionResource($competition),
        ]);
    }
}
