<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ResumeController extends Controller
{
    /**
     * Stream the resume PDF as a download.
     *
     * Resolves the file from storage first (preferred location), then falls
     * back to public/resume.pdf so the route stays useful during local setup.
     */
    public function download(): BinaryFileResponse
    {
        $candidates = [
            storage_path('app/public/Carl_Justin_Agapito_CV.pdf'),
            public_path('resume.pdf'),
        ];

        foreach ($candidates as $path) {
            if (is_file($path)) {
                return response()->download($path, 'Carl-Justin-Agapito-CV.pdf', [
                    'Content-Type' => 'application/pdf',
                ]);
            }
        }

        throw new NotFoundHttpException('Resume not available.');
    }
}
