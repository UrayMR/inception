<?php

namespace Tests\Feature\Panel\Transaction;

use App\Enums\TransactionStatus;
use App\Enums\TeamStatus;
use App\Models\Transaction;

class TransactionVerifyTest extends TransactionTestCase
{
  public function test_admin_can_verify_transaction_and_update_team_status(): void
  {
    // Arrange
    $admin = $this->makeAdminUser();
    $transaction = Transaction::factory()->create([
      'status' => TransactionStatus::pending->value,
    ]);

    // Act
    $response = $this->actingAs($admin)
      ->patch(route('panel.transactions.verify', $transaction));

    // Assert
    $response->assertRedirect(route('panel.transactions.index'));

    $transaction->refresh();
    $this->assertSame(TransactionStatus::verified->value, $transaction->status);
    $this->assertSame(TeamStatus::registered->value, $transaction->team->status);
  }

  public function test_admin_can_reject_transaction_and_update_team_status(): void
  {
    // Arrange
    $admin = $this->makeAdminUser();
    $transaction = Transaction::factory()->create([
      'status' => TransactionStatus::pending->value,
    ]);

    // Act
    $response = $this->actingAs($admin)
      ->patch(route('panel.transactions.reject', $transaction));

    // Assert
    $response->assertRedirect(route('panel.transactions.index'));

    $transaction->refresh();
    $this->assertSame(TransactionStatus::rejected->value, $transaction->status);
    $this->assertSame(TeamStatus::rejected->value, $transaction->team->status);
  }
}
