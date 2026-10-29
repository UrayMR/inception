<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Services\Announcements\BulkAnnouncementService;
use Illuminate\Http\Request;

class BulkAnnouncementController extends Controller
{
  public function __construct(
    protected BulkAnnouncementService $bulkAnnouncementService
  ) {}

  /**
   * Send bulk announcements for Hackathon teams.
   */
  public function send(Request $request)
  {
    $validated = $request->validate([
      'blacklist' => ['required', 'string'],
    ]);

    $result = $this->bulkAnnouncementService->sendAnnouncements($validated['blacklist']);

    $this->flash(
      'success',
      "Bulk announcement selesai. Total: {$result['total']}, terkirim: {$result['sent']}, gagal: {$result['failed']}, blacklist: {$result['blacklisted']}."
    );

    return redirect()->back();
  }
}
