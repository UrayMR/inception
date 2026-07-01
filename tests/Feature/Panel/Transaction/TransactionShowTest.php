<?php

namespace Tests\Feature\Panel\Transaction;

use App\Models\Transaction;
use Inertia\Testing\AssertableInertia as Assert;

class TransactionShowTest extends TransactionTestCase
{
  public function test_admin_can_view_transaction_show(): void
  {
    // Arrange
    $admin = $this->makeAdminUser();
    $transaction = Transaction::factory()->create();

    // Act
    $response = $this->actingAs($admin)->get(route('panel.transactions.show', $transaction));

    // Assert
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/transactions/show')
          ->has('transaction')
      );
  }
}
