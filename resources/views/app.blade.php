<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="canonical" href="{{ request()->url() }}" />

	@if (isset($page['props']['seo']['index']) && $page['props']['seo']['index'])
		<meta name="robots" content="index, follow" />
	@else
		<meta name="robots" content="noindex, nofollow" />
	@endif

	<meta name="description"
		content="{{ $page['props']['seo']['description'] ?? 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!' }}" />

	<meta name="keywords"
		content="{{ $page['props']['seo']['keywords'] ?? 'INCEPTION 2026, kompetisi informatika, lomba informatika, kompetisi nasional, lomba nasional, UI/UX Competition, Data Science Competition, Online Hackathon, Business Plan Competition, mahasiswa, teknologi, kreativitas, inovasi, website lomba, kompetisi teknologi, kompetisi mahasiswa, lomba mahasiswa, kompetisi coding, lomba coding, kompetisi desain, lomba desain, kompetisi bisnis, lomba bisnis, kompetisi teknologi informasi, lomba teknologi informasi' }}" />

	<meta name="author" content="{{ $page['props']['seo']['author'] ?? 'INCEPTION 2026' }}" />

	{{-- Open Graph (OG) Tags --}}
	<meta property="og:type" content="website" />
	<meta property="og:site_name"
		content="{{ $page['props']['seo']['site_name'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta property="og:url" content="{{ request()->url() }}" />
	<meta property="og:title"
		content="{{ $page['props']['seo']['title'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta property="og:description"
		content="{{ $page['props']['seo']['description'] ?? 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!' }}" />
	<meta property="og:image"
		content="{{ $page['props']['seo']['image'] ?? asset('assets/png/seo/seo-thumbnail.png') }}" />
	<meta property="og:image:alt"
		content="{{ $page['props']['seo']['image_alt'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	{{-- Twitter Cards Tags --}}
	<meta name="twitter:creator"
		content="{{ $page['props']['seo']['author'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta name="twitter:site"
		content="{{ $page['props']['seo']['site_name'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title"
		content="{{ $page['props']['seo']['title'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta name="twitter:description"
		content="{{ $page['props']['seo']['description'] ?? 'Kompetisi informatika tingkat nasional yang menjadi wadah bagi mahasiswa untuk berinovasi, mengembangkan solusi kreatif, dan menunjukkan kemampuan terbaik melalui UI/UX, Data Science, Online Hackathon, dan Business Plan Competition. Wujudkan ide menjadi karya yang berdampak!' }}" />
	<meta name="twitter:image"
		content="{{ $page['props']['seo']['image'] ?? asset('assets/png/seo/seo-thumbnail.png') }}" />
	<meta name="twitter:image:alt"
		content="{{ $page['props']['seo']['image_alt'] ?? 'INCEPTION 2026 - Code The Future Create The Impact' }}" />
	<meta name="twitter:image:width" content="1200" />
	<meta name="twitter:image:height" content="630" />

	{{-- JSON-LD Script --}}
	@if ($page['props']['seo']['json_ld'] ?? false)
		<script type="application/ld+json">
            {!! json_encode($page['props']['seo']['json_ld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) !!}
        </script>
	@endif

	{{-- Inline script to detect system dark mode preference and apply it immediately --}}
	<script>
		(function() {
			const appearance = '{{ $appearance ?? 'system' }}';

			if (appearance === 'system') {
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

				if (prefersDark) {
					document.documentElement.classList.add('dark');
				}
			}
		})();
	</script>

	{{-- Inline style to set the HTML background color based on our theme in app.css --}}
	<style>
		html {
			background-color: oklch(1 0 0);
		}

		html.dark {
			background-color: oklch(0.145 0 0);
		}
	</style>

	<link rel="icon" href="/favicon.ico" sizes="any">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="/apple-touch-icon.png">

	@fonts

	@viteReactRefresh
	@vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
	<x-inertia::head>
		<title>{{ config('app.name', 'Laravel') }}</title>
	</x-inertia::head>
</head>

<body class="font-sans antialiased">
	<x-inertia::app />
</body>

</html>
