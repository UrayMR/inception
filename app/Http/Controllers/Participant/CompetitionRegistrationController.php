<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Enums\CompetitionStatus;
use App\Mail\CompetitionRegisteredMail;
use App\Models\Competition;
use App\Resources\Participant\Competitions\CompetitionListResource;
use App\Resources\Participant\Competitions\CompetitionDetailResource;
use App\Services\Competitions\CompetitionService;
use App\Services\Competitions\GuestCompetitionService;
use App\Services\Competitions\Registrations\RegisterCompetitionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class CompetitionRegistrationController extends Controller
{
    public function __construct(
        protected CompetitionService $competitionService,
        protected GuestCompetitionService $guestCompetitionService,
        protected RegisterCompetitionService $registerCompetitionService,
    ) {}

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $competitions = $this->guestCompetitionService->index($request);

        return $this->render('guest/competitions/index', [
            'competitions' => CompetitionListResource::collection($competitions),
        ]);
    }

    /**
     * Show the form for registering a resource.
     */
    public function register()
    {
        // TODO: is this really necessary? how about policy? or middleware?
        if (Auth::check() && ! $this->registerCompetitionService->isCanRegister()) {
            $this->flash('error', 'Anda sudah memiliki pendaftaran kompetisi yang sedang diproses atau sudah diverifikasi. Silakan cek dashboard Anda untuk informasi lebih lanjut.');

            return back();
        }

        return $this->render('participant/competitions/register', [
            'competitionMap' => $this->competitionService->getCompetitionMap([
                'status' => CompetitionStatus::open->value,
            ]),
        ]);
    }

    /**
     * Store a newly registered resource in storage.
     */
    public function store(RegisterCompetitionRequest $request)
    {
        $dto = $request->toDTO();
        $competition = $this->competitionService->findByIdOrFail($dto->competition_id);

        $this->registerCompetitionService->register($dto, $competition);

        $this->flash('success', 'Pendaftaran kompetisi berhasil.');
        $this->flash('success', 'Mohon menunggu konfirmasi berkas pendaftaran kompetisi dari panitia. Silakan cek (spam) email Anda atau dashboard untuk informasi lebih lanjut.');

        return redirect()->route('settings.index');
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Competition $competition)
    {
        $competition->load('timelines');

        return $this->render('guest/competitions/show', [
            'competition' => CompetitionDetailResource::make($competition)->resolve(),
            'allCompetitions' => Competition::query()->get(),
        ]);
    }
}
