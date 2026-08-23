<?php

namespace App\Http\Controllers\Panel;

use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Http\Controllers\Controller;
use App\Http\Requests\Announcements\StoreAnnouncementRequest;
use App\Http\Requests\Announcements\UpdateAnnouncementRequest;
use App\Services\Announcements\AnnouncementService;

class AnnouncementController extends Controller
{
    public function __construct(
        protected AnnouncementService $announcementService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnnouncementRequest $request)
    {
        $this->authorize('create', Announcement::class);

        $this->announcementService->store($request->toDTO());

        $this->flash('success', 'Announcement created successfully.');

        return redirect()->route('panel.configuration');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $this->authorize('update', $announcement);

        $this->announcementService->update($request->toDTO(), $announcement);

        $this->flash('success', 'Announcement updated successfully.');

        return redirect()->route('panel.configuration');
    }
}
