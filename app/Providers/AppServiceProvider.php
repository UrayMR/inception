<?php

namespace App\Providers;

use App\Repositories\Competitions\CompetitionRepository;
use App\Repositories\Competitions\EloquentCompetitionRepository;
use App\Repositories\Competitions\Timelines\EloquentTimelineRepository;
use App\Repositories\Competitions\Timelines\TimelineRepository;
use App\Repositories\Teams\EloquentTeamRepository;
use App\Repositories\Teams\Members\EloquentMemberRepository;
use App\Repositories\Teams\Members\MemberRepository;
use App\Repositories\Teams\TeamRepository;
use App\Repositories\Users\EloquentUserRepository;
use App\Repositories\Users\UserRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
        $this->app->bind(CompetitionRepository::class, EloquentCompetitionRepository::class);
        $this->app->bind(TimelineRepository::class, EloquentTimelineRepository::class);
        $this->app->bind(TeamRepository::class, EloquentTeamRepository::class);
        $this->app->bind(MemberRepository::class, EloquentMemberRepository::class);

        // ... Bind other repositories here
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }
}
