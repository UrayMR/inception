<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\StoreTeamRequest;
use App\Http\Requests\Teams\UpdateTeamRequest;
use App\Models\Team;
use App\Resources\Teams\EditTeamResource;
use App\Resources\Teams\IndexTeamResource;
use App\Resources\Teams\ShowTeamResource;
use App\Services\Competitions\CompetitionService;
use App\Services\Teams\TeamService;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function __construct(
        protected TeamService $teamService,
        protected CompetitionService $competitionService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Team::class);

        $teams = $this->teamService->index($request);

        return $this->render('panel/teams/index', [
            'teams' => IndexTeamResource::collection($teams),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Team::class);

        return $this->render('panel/teams/create', [
            'competitionMap' => $this->competitionService->getCompetitionMap(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeamRequest $request)
    {
        $this->authorize('create', Team::class);

        $this->teamService->store($request->toTeamDTO(), $request->input('members', []));

        $this->flash('success', 'Team created successfully.');

        return redirect()->route('panel.teams.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        $this->authorize('view', $team);

        $team->load(['members', 'competition', 'leader']);

        return $this->render('panel/teams/show', [
            'team' => ShowTeamResource::make($team)->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Team $team)
    {
        $this->authorize('update', $team);

        $team->load(['members', 'competition', 'leader']);

        return $this->render('panel/teams/edit', [
            'team' => EditTeamResource::make($team)->resolve(),
            'competitionMap' => $this->competitionService->getCompetitionMap(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        $this->authorize('update', $team);

        $this->teamService->update($request->toTeamDTO(), $team, $request->input('members', []));

        $this->flash('success', 'Team updated successfully.');

        return redirect()->route('panel.teams.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        $isDeleted = $this->teamService->destroy($team);
        if (! $isDeleted) {
            $this->flash('error', 'Failed to delete team and members.');

            return redirect()->back();
        }

        $this->flash('success', 'Team deleted successfully.');

        return redirect()->route('panel.teams.index');
    }
}
