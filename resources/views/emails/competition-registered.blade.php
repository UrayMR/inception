<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="color-scheme" content="light">
	<meta name="supported-color-schemes" content="light">
	<!--[if mso]>
				<noscript>
								<xml>
												<o:OfficeDocumentSettings>
																<o:PixelsPerInch>96</o:PixelsPerInch>
												</o:OfficeDocumentSettings>
								</xml>
				</noscript>
				<style>
								table, td { border-collapse: collapse; }
								* { font-family: Arial, sans-serif !important; }
				</style>
				<![endif]-->
	<title>INCEPTION - Pendaftaran Kompetisi</title>
	<style>
		@media only screen and (max-width: 480px) {
			.container-card {
				border-radius: 12px !important;
			}

			.hero-title {
				font-size: 20px !important;
			}

			.hero-pad {
				padding: 30px 16px 12px 16px !important;
			}

			.body-pad {
				padding: 10px 20px 24px 20px !important;
			}

			.btn-link {
				padding: 13px 22px !important;
				font-size: 12px !important;
			}
		}
	</style>
</head>

<body
	style="margin: 0; padding: 0; background-color: #0c0214; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

	@php
		$rawStatus = strtolower(trim($transaction_status ?? ''));
	@endphp

	<!-- Preheader text -->
	<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#0c0214;">
		@if ($rawStatus === 'verified')
			Selamat! Pendaftaran Anda untuk {{ $competition_name }} telah terverifikasi. Silahkan cek dashboard untuk melihat detail pendaftaran &amp; tugas Anda selanjutnya.
		@elseif ($rawStatus === 'rejected')
			Mohon maaf, pendaftaran Anda untuk {{ $competition_name }} ditolak karena terdapat ketidaksesuaian data atau dokumen. Silahkan lakukan pendaftaran ulang untuk kompetisi yang ingin anda ikuti. 
		@else
			Pendaftaran Anda untuk {{ $competition_name }} berhasil &amp; sedang diverifikasi. Silahkan cek email secara berkala untuk update status pendaftaran.
		@endif
	</div>
	<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
		&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;
	</div>

	<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0c0214"
		style="background-color: #0c0214; background-image: radial-gradient(circle at top center, #1e0036 0%, #0c0214 70%); border-collapse: collapse;">
		<tr>
			<td align="center" bgcolor="#0c0214" style="padding: 30px 10px;">

				<!--[if mso]>
								<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td>
								<![endif]-->
				<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0f051d"
					class="container-card"
					style="max-width: 600px; background-color: #0f051d; border: 1px solid rgba(177, 59, 255, 0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); border-collapse: collapse;">

					<tr>
						<td align="center" class="hero-pad" style="padding: 40px 20px 15px 20px;">
							<p
								style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; color: #b13bff; letter-spacing: 3px; text-transform: uppercase; mso-line-height-rule: exactly;">
								@if ($rawStatus === 'verified')
									// STATUS_VERIFIED_SUCCESS
								@elseif ($rawStatus === 'rejected')
									// STATUS_MISMATCH_ERROR
								@else
									// INITIALIZE_LAUNCH_SUCCESS
								@endif
							</p>
						</td>
					</tr>

					<tr>
						<td align="center" style="padding: 0 25px 25px 25px;">
							<h1 class="hero-title"
								style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; font-family: Arial, sans-serif; text-align: center; line-height: 1.3; mso-line-height-rule: exactly;">
								CODE THE FUTURE<br>CREATE THE <span style="color: #b13bff;">IMPACT</span>
							</h1>
							<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="50"
								style="margin: 0 auto; border-collapse: collapse;">
								<tr>
									<td height="3" style="background-color: #ffcc00; border-radius: 2px; font-size: 1px; line-height: 1px;">
										&nbsp;</td>
								</tr>
							</table>
						</td>
					</tr>

					<tr>
						<td class="body-pad" style="padding: 10px 30px 30px 30px; text-align: center;">

							<!-- Pembuka Dinamis -->
							<p
								style="margin: 0 0 15px 0; font-size: 15px; color: #f7f4e9; line-height: 1.6; font-weight: 300; mso-line-height-rule: exactly;">
								@if ($competition_type === 'solo')
									Halo <strong style="color: #ffffff; font-weight: 600;">{{ $team_name }}</strong>,
								@else
									Halo Tim <strong style="color: #ffffff; font-weight: 600;">{{ $team_name }}</strong>,
								@endif
							</p>

							<!-- Deskripsi Dinamis Berdasarkan Status -->
							<p
								style="margin: 0 0 30px 0; font-size: 14px; color: #b5a9c2; line-height: 1.6; font-weight: 300; mso-line-height-rule: exactly;">
								@if ($rawStatus === 'verified')
									@if ($competition_type === 'solo')
										Selamat! Berkas pendaftaran Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> telah berhasil diverifikasi.
										Anda kini telah resmi terdaftar sebagai peserta.
									@else
										Selamat! Berkas pendaftaran tim Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> telah berhasil diverifikasi.
										Tim Anda resmi terdaftar sebagai peserta.
									@endif
								@elseif ($rawStatus === 'rejected')
									@if ($competition_type === 'solo')
										Mohon maaf, berkas pendaftaran Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> belum dapat disetujui karena
										terdapat ketidaksesuaian data atau dokumen.
									@else
										Mohon maaf, berkas pendaftaran tim Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> belum dapat disetujui karena
										terdapat ketidaksesuaian data atau dokumen.
									@endif
								@else
									@if ($competition_type === 'solo')
										Selamat! Pendaftaran Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> telah berhasil. Berkas Anda saat
										ini sedang berada dalam proses verifikasi oleh panitia.
									@else
										Selamat! Pendaftaran tim Anda untuk kompetisi <strong
											style="color: #ffffff; font-weight: 600;">{{ $competition_name }}</strong> telah berhasil. Berkas tim Anda
										saat ini sedang dalam proses verifikasi oleh panitia.
									@endif
								@endif
							</p>

							<!-- Box Informasi Dinamis -->
							<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
								style="background-color: rgba(15, 5, 29, 0.6); border: 1px solid rgba(177, 59, 255, 0.1); border-radius: 10px; margin-bottom: 30px; border-collapse: collapse;">
								<tr>
									<td style="padding: 20px; text-align: left;">
										<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
											style="border-collapse: collapse;">

											@if ($competition_type === 'solo')
												<tr>
													<td width="30%"
														style="padding-bottom: 8px; font-size: 12px; color: #726285; font-family: monospace; vertical-align: top;">
														[NAME]</td>
													<td width="70%"
														style="padding-bottom: 8px; font-size: 14px; color: #ffffff; font-weight: bold; vertical-align: top;">
														{{ $team_name }}</td>
												</tr>
											@else
												<tr>
													<td width="30%"
														style="padding-bottom: 8px; font-size: 12px; color: #726285; font-family: monospace; vertical-align: top;">
														[TEAM_NAME]</td>
													<td width="70%"
														style="padding-bottom: 8px; font-size: 14px; color: #ffffff; font-weight: bold; vertical-align: top;">
														{{ $team_name }}</td>
												</tr>
												<tr>
													<td width="30%"
														style="padding-bottom: 8px; font-size: 12px; color: #726285; font-family: monospace; vertical-align: top;">
														[LEADER]</td>
													<td width="70%"
														style="padding-bottom: 8px; font-size: 14px; color: #ffffff; font-weight: bold; vertical-align: top;">
														{{ $leader_name }}</td>
												</tr>
											@endif

											<tr>
												<td width="30%" style="font-size: 12px; color: #726285; font-family: monospace; vertical-align: top;">
													[STATUS]</td>
												<td width="70%"
													style="font-size: 14px; color: {{ $rawStatus === 'verified' ? '#00e676' : ($rawStatus === 'rejected' ? '#ff5252' : '#ffcc00') }}; font-weight: bold; vertical-align: top;">
													{{ $status_label ?? $transaction_status }}
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>

							<!-- Action Button -->
							<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $url }}" style="height:46px;v-text-anchor:middle;width:230px;" arcsize="17%" strokecolor="#b13bff" fillcolor="#b13bff">
																		<w:anchorlock/>
																		<center style="color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;">MASUK KE DASHBOARD</center>
														</v:roundrect>
														<![endif]-->
							<!--[if !mso]><!-->
							<table role="presentation" border="0" cellpadding="0" cellspacing="0"
								style="margin: 0 auto; border-collapse: collapse;">
								<tr>
									<td align="center"
										style="border-radius: 8px; background-color: #b13bff; box-shadow: 0 4px 15px rgba(177, 59, 255, 0.4);">
										<a href="{{ $url }}" class="btn-link"
											style="padding: 14px 28px; display: inline-block; font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">
											@if ($rawStatus === 'rejected')
												Daftar Ulang
											@else
												Masuk Ke Dashboard
											@endif
										</a>
									</td>
								</tr>
							</table>
							<!--<![endif]-->
						</td>
					</tr>

					<tr>
						<td style="padding: 0 30px 40px 30px; text-align: center;">
							<p style="margin: 0; font-size: 13px; color: #726285; line-height: 1.5; mso-line-height-rule: exactly;">
								@if ($rawStatus === 'rejected')
									Silakan lakukan pendaftaran ulang untuk kompetisi yang ingin anda ikuti. Jika Anda memiliki pertanyaan atau
									membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan
									Instagram <a href="https://instagram.com/inception"
										style="color: #b13bff; text-decoration: none; font-weight: bold;">@inception</a>.
								@else
									Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan
									kami melalui Instagram <a href="https://instagram.com/inception"
										style="color: #b13bff; text-decoration: none; font-weight: bold;">@inception</a>.
								@endif
							</p>
						</td>
					</tr>

					<tr>
						<td align="center"
							style="padding: 20px; background-color: #080110; border-top: 1px solid rgba(177, 59, 255, 0.08);">
							<p style="margin: 0; font-family: monospace; font-size: 10px; color: #493b5c; letter-spacing: 1px;">
								&copy; 2026 INCEPTION
							</p>
						</td>
					</tr>

				</table>
				<!--[if mso]>
								</td></tr></table>
								<![endif]-->

			</td>
		</tr>
	</table>
</body>

</html>
