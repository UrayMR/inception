<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Requests\Assignments\StoreAssignmentRequest;
use App\Http\Requests\Assignments\UpdateAssignmentRequest;
use App\Models\Assignment;
use App\Resources\Assignments\EditAssignmentResource;
use App\Resources\Assignments\IndexAssignmentResource;
use App\Resources\Assignments\ShowAssignmentResource;
use App\Services\Assignments\AssignmentService;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
  public function __construct(
    protected AssignmentService $assignmentService,
  ) {}

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $this->authorize('viewAny', Assignment::class);

    $queryParams = $request->all();
    $assignments = $this->assignmentService->index($queryParams);

    return $this->render('panel/assignments/index', [
      'assignments' => IndexAssignmentResource::collection($assignments),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $this->authorize('create', Assignment::class);

    return $this->render('panel/assignments/create');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAssignmentRequest $request)
  {
    $this->authorize('create', Assignment::class);

    $this->assignmentService->store($request->toDTO());

    $this->flash('success', 'Competition created successfully.');

    return redirect()->route('panel.assignments.index');
  }

  /**
   * Display the specified resource.
   */
  public function show(Assignment $assignment)
  {
    $this->authorize('view', $assignment);

    $assignment->load('competition');

    return $this->render('panel/assignments/show', [
      'competition' => ShowAssignmentResource::make($assignment)->resolve(),
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Assignment $assignment)
  {
    $this->authorize('update', $assignment);

    $assignment->load('competition');

    return $this->render('panel/assignments/edit', [
      'assignment' => EditAssignmentResource::make($assignment)->resolve(),
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAssignmentRequest $request, Assignment $assignment)
  {
    $this->authorize('update', $assignment);

    $this->assignmentService->update($request->toDTO(), $assignment);

    $this->flash('success', 'Assignment updated successfully.');

    return redirect()->route('panel.assignments.index');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Assignment $assignment)
  {
    $this->authorize('delete', $assignment);

    $isDeleted = $this->assignmentService->destroy($assignment);

    if (! $isDeleted) {
      $this->flash('error', 'Failed to delete assignment.');

      return redirect()->back();
    }

    $this->flash('success', 'Assignment deleted successfully.');

    return redirect()->route('panel.assignments.index');
  }
}
