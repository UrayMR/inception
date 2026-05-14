<?php

namespace App\Http\Controllers;

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
     * Flash a message to the session for the next request.
     *
     * @param  string  $key  The key for the flash message.
     * @param  mixed  $value  The value of the flash message.
     * @return $this
     */
    protected function flash(string $key, mixed $value = null)
    {
        Inertia::flash($key, $value);

        return $this;
    }
}
