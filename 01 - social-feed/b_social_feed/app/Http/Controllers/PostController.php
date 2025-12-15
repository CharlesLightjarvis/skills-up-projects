<?php

namespace App\Http\Controllers;

use App\Events\PostCreated;
use App\Events\PostDeleted;
use App\Events\PostUpdated;
use App\Http\Requests\posts\StorePostRequest;
use App\Http\Requests\posts\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $posts = Post::with('user')->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => PostResource::collection($posts)], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $data = $request->validated();

        $data['user_id'] = Auth::id();
        $post = Post::create($data);
        $post->load('user');

        broadcast(new PostCreated($post))->toOthers();

        return response()->json(['data' => PostResource::make($post), 'message' => 'Post created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $post->update($data);

        $post->load('user');

        broadcast(new PostUpdated($post))->toOthers();

        return response()->json(['data' => PostResource::make($post), 'message' => 'Post updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        broadcast(new PostDeleted($post))->toOthers();
    
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }

    /**
     * Toggle like on a post
     */
    public function toggleLike(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        // Vérifier si l'utilisateur a déjà liké
        $existingLike = $post->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $message = 'Like retiré';
        } else {
            // Like
            $post->likes()->create([
                'user_id' => $user->id,
            ]);
            $message = 'Post liké';
        }

        // Recharger le post avec les relations
        $post->load('user');

        // Broadcaster la mise à jour à tous les clients connectés
        broadcast(new PostUpdated($post))->toOthers();

        return response()->json([
            'data' => PostResource::make($post),
            'message' => $message,
        ]);
    }
}
