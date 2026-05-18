<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * The default storage disk to use.
     */
    protected string $disk;

    /**
     * Create a new FileService instance.
     *
     * @param  string  $disk  The default storage disk (e.g., 'public', 'private').
     */
    public function __construct(string $disk = 'public')
    {
        $this->disk = $disk;
    }

    /**
     * Store a file in the specified directory and return its storage path.
     *
     * @param  UploadedFile  $file  The file to be stored.
     * @param  string  $directory  The directory where the file will be stored.
     * @param  string|null  $disk  The storage disk to use (optional).
     * @return string The path of the stored file relative to the disk root.
     */
    public function store(UploadedFile $file, string $directory, ?string $disk = null): string
    {
        return $file->store($directory, $disk ?? $this->disk);
    }

    /**
     * Replace an existing file with a new one. Deletes the old file if provided, then stores the new file.
     *
     * @param  UploadedFile  $file  The new file to be stored.
     * @param  string|null  $oldPath  The path of the old file to be deleted (optional).
     * @param  string  $directory  The directory where the new file will be stored.
     * @param  string|null  $disk  The storage disk to use (optional).
     * @return string The path of the newly stored file relative to the disk root.
     */
    public function update(UploadedFile $file, ?string $oldPath, string $directory, ?string $disk = null): string
    {
        if ($oldPath) {
            $this->delete($oldPath, $disk);
        }

        return $this->store($file, $directory, $disk);
    }

    /**
     * Delete a file by its storage path.
     *
     * @param  string  $path  The path of the file to be deleted, relative to the disk root.
     * @param  string|null  $disk  The storage disk to use (optional).
     * @return bool True if the file was deleted, false if it did not exist or deletion failed.
     */
    public function delete(string $path, ?string $disk = null): bool
    {
        $diskToUse = $disk ?? $this->disk;

        return Storage::disk($diskToUse)->exists($path) ? Storage::disk($diskToUse)->delete($path) : false;
    }
}
