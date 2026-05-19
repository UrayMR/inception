<?php

namespace App\Http\Controllers;

use App\Enums\CompetitionType;
use App\Http\Requests\Teams\StoreTeamRequest;
use App\Http\Requests\Teams\UpdateTeamRequest;
use App\Models\Team;
use App\Resources\Teams\EditTeamResource;
use App\Resources\Teams\IndexTeamResource;
use App\Resources\Teams\ShowTeamResource;
use App\Services\Competitions\CompetitionService;
use App\Services\Teams\MemberService;
use App\Services\Teams\TeamService;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    // NOTE:
    // Team should be created by the user who is the leader of the team,
    // so the leader_id will be set to the authenticated user id, and cannot be changed/updated.

    // Team creation only appears when registering for a competition,
    // so the competition_id will be set based on the competition that the user is registering for,
    // and all of team detail cannot be changed/updated.

    // This Controller only handling the team management by admin,
    // so the team can be updated and deleted by admin, but not by the leader of the team.

    public function __construct(
        protected TeamService $teamService,
        protected MemberService $memberService,
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

        $team = $this->teamService->create($request->toTeamDTO());

        $this->memberService->createMany($team, $request->toMemberDTO($team->id));

        $this->flash('success', 'Team created successfully.');

        return redirect()->route('teams.index');
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

        $team = $this->teamService->update($request->toTeamDTO(), $team);

        $this->memberService->updateMany($team, $request->toMemberDTO($team->id));

        $this->flash('success', 'Team updated successfully.');

        return redirect()->route('teams.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        if ($team->competition->type === CompetitionType::team->value) {
            $isMemberDeleted = $this->memberService->destroyMany($team);
            if (! $isMemberDeleted) {
                $this->flash('error', 'Failed to delete team members.');

                return redirect()->back();
            }
        }

        $this->teamService->destroy($team);

        $this->flash('success', 'Team deleted successfully.');

        return redirect()->route('teams.index');
    }
}
