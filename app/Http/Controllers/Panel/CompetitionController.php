<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Requests\Competitions\StoreCompetitionRequest;
use App\Http\Requests\Competitions\UpdateCompetitionRequest;
use App\Models\Competition;
use App\Resources\Competitions\EditCompetitionResource;
use App\Resources\Competitions\IndexCompetitionResource;
use App\Resources\Competitions\ShowCompetitionResource;
use App\Services\Competitions\CompetitionService;
use Illuminate\Http\Request;

class CompetitionController extends Controller
{
    public function __construct(
        protected CompetitionService $competitionService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Competition::class);

        $competitions = $this->competitionService->index($request);

        return $this->render('panel/competitions/index', [
            'competitions' => IndexCompetitionResource::collection($competitions),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Competition::class);

        return $this->render('panel/competitions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompetitionRequest $request)
    {
        $this->authorize('create', Competition::class);

        $this->competitionService->store($request->toCompetitionDTO(), $request->input('timelines', []));

        $this->flash('success', 'Competition created successfully.');

        return redirect()->route('panel.competitions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Competition $competition)
    {
        $this->authorize('view', $competition);

        $competition->load('timelines');

        return $this->render('panel/competitions/show', [
            'competition' => ShowCompetitionResource::make($competition)->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Competition $competition)
    {
        $this->authorize('update', $competition);

        $competition->load('timelines');

        return $this->render('panel/competitions/edit', [
            'competition' => EditCompetitionResource::make($competition)->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompetitionRequest $request, Competition $competition)
    {
        $this->authorize('update', $competition);

        $this->competitionService->update($request->toCompetitionDTO(), $competition, $request->toTimelineDTO($competition->id));

        $this->flash('success', 'Competition updated successfully.');

        return redirect()->route('panel.competitions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Competition $competition)
    {
        $this->authorize('delete', $competition);

        $isDeleted = $this->competitionService->destroy($competition);
        if (! $isDeleted) {
            $this->flash('error', 'Failed to delete competition timelines.');

            return redirect()->back();
        }

        $this->flash('success', 'Competition deleted successfully.');

        return redirect()->route('panel.competitions.index');
    }
}
