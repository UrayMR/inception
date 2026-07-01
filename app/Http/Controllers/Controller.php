<?php

namespace App\Http\Controllers;

use App\Utilities\FlashResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

abstract class Controller
{
    use AuthorizesRequests;

    /**
     * Render an Inertia response with a standardized payload structure.
     *
     * @param  string  $component  The Inertia component to render.
     * @param  array  $props  Optional props to pass to the component.
     * @return Response
     */
    protected function render(string $component, array $props = [])
    {
        return Inertia::render($component, $props);
    }

    /**
     * Flash a toast message to the session for the next request using FlashResponse utility.
     *
     * @param  string  $type  The type of the toast (success, info, error).
     * @param  string  $message  The message to display.
     * @return $this
     */
    protected function flash(string $type, string $message)
    {
        FlashResponse::{$type}($message);

        return $this;
    }
}
