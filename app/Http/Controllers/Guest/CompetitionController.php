<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use App\Resources\Competitions\IndexCompetitionResource;
use App\Resources\Competitions\ShowCompetitionResource;
use App\Resources\Guest\Competitions\RegisterCompetitionResource;
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return redirect()->route('guest.competitions.index');
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        return $this->render('guest/competitions/edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Competition $competition)
    {
        return redirect()->route('guest.competitions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Competition $competition)
    {
        return redirect()->route('guest.competitions.index');
    }
}
