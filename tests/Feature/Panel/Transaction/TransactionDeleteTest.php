<?php

namespace Tests\Feature\Panel\Transaction;

use App\Models\Transaction;

class TransactionDeleteTest extends TransactionTestCase
{
  public function test_admin_can_delete_transaction(): void
  {
    // Arrange
    $admin = $this->makeAdminUser();
    $transaction = Transaction::factory()->create();

    // Act
    $response = $this->actingAs($admin)
      ->delete(route('panel.transactions.destroy', $transaction));

    // Assert
    $response->assertRedirect(route('panel.transactions.index'));
    $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
  }
}
