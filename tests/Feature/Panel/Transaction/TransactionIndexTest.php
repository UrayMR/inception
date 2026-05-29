<?php

namespace Tests\Feature\Panel\Transaction;

use App\Models\Transaction;
use Inertia\Testing\AssertableInertia as Assert;

class TransactionIndexTest extends TransactionTestCase
{
  public function test_guest_is_redirected_from_transaction_index(): void
  {
    // Arrange: no authenticated user

    // Act: visit index route
    $response = $this->get(route('panel.transactions.index'));

    // Assert: redirected to login
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_transaction_index(): void
  {
    // Arrange
    $admin = $this->makeAdminUser();
    Transaction::factory()->count(3)->create();

    // Act
    $response = $this->actingAs($admin)->get(route('panel.transactions.index'));

    // Assert
    $response
      ->assertOk()
      ->assertInertia(fn(Assert $page) => $page
        ->component('panel/transactions/index')
        ->has('transactions')
      );
  }
}
