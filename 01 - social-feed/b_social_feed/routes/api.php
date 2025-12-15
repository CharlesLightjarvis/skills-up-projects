<?php

use App\Http\Controllers\PostController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return response()->json(['user' => UserResource::make($request->user())]);
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);
Route::post('posts/{post}/like', [PostController::class, 'toggleLike']);
