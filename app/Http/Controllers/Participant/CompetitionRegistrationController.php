<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\Competitions\RegisterCompetitionRequest;
use App\Models\Competition;
use App\Resources\Participant\Competitions\CompetitionListResource;
use App\Resources\Participant\Competitions\CompetitionDetailResource;
use App\Services\Competitions\CompetitionService;
use App\Services\Competitions\CompetitionRegistrationService;
use Illuminate\Http\Request;

class CompetitionRegistrationController extends Controller
{
    public function __construct(
        protected CompetitionService $competitionService,
        protected CompetitionRegistrationService $competitionRegistrationService,
    ) {}

    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $competitions = $this->competitionService->index($request);

        return $this->render('participant/competitions/index', [
            'competitions' => CompetitionListResource::collection($competitions),
        ]);
    }

    /**
     * Show the form for registering a resource.
     */
    public function register()
    {
        return $this->render('participant/competitions/register', [
            'competitionMap' => $this->competitionService->getCompetitionMap(),
        ]);
    }

    /**
     * Store a newly registered resource in storage.
     */
    public function store(RegisterCompetitionRequest $request)
    {
        $competition = $this->competitionService->findByIdOrFail($request->input('competition_id'));

        $this->competitionRegistrationService->register($request, $competition);

        $this->flash('success', 'Competition registration submitted successfully.');
        $this->flash('success', 'Please kindly wait for the verification of your transaction. Thank you!');

        return redirect()->route('participant.competitions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Competition $competition)
    {
        $competition->load('timelines');

        return $this->render('participant/competitions/show', [
            'competition' => CompetitionDetailResource::make($competition)->resolve(),
        ]);
    }
}
