<?php

namespace App\Http\Controllers\Panel;

use App\Models\Transaction;
use App\Resources\Transactions\IndexTransactionResource;
use App\Resources\Transactions\ShowTransactionResource;
use App\Services\Transactions\TransactionService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\MailService;

class TransactionController extends Controller
{
  public function __construct(
    protected TransactionService $transactionService,
  ) {}

  public function index(Request $request)
  {
    $this->authorize('viewAny', Transaction::class);

    $queryParams = $request->all();
    $transactions = $this->transactionService->index($queryParams);

    return $this->render('panel/transactions/index', [
      'transactions' => IndexTransactionResource::collection($transactions),
    ]);
  }

  public function show(Transaction $transaction)
  {
    $this->authorize('view', $transaction);

    $transaction->load([
      'team.competition',
      'team.leader',
      'team.members',
    ]);

    return $this->render('panel/transactions/show', [
      'transaction' => ShowTransactionResource::make($transaction)->resolve(),
    ]);
  }

  public function verify(Transaction $transaction, Request $request)
  {
    $this->authorize('update', $transaction);

    $notifyEmail = (bool) $request->query('notify_email', false);

    $this->transactionService->verify($transaction, $notifyEmail);

    $this->flash('success', 'Transaction verified successfully.');

    if ($notifyEmail) {
      $this->flash('success', 'Notification email sent to the team leader.');
    }

    return redirect()->route('panel.transactions.index');
  }

  public function reject(Transaction $transaction, Request $request)
  {
    $this->authorize('update', $transaction);

    $notifyEmail = (bool) $request->query('notify_email', false);

    $this->transactionService->reject($transaction, $notifyEmail);

    $this->flash('success', 'Transaction rejected successfully.');

    if ($notifyEmail) {
      $this->flash('success', 'Notification email sent to the team leader.');
    }

    return redirect()->route('panel.transactions.index');
  }

  public function destroy(Transaction $transaction)
  {
    $this->authorize('delete', $transaction);

    $isDeleted = $this->transactionService->destroy($transaction);
    if (! $isDeleted) {
      $this->flash('error', 'Failed to delete transaction.');

      return redirect()->back();
    }

    $this->flash('success', 'Transaction deleted successfully.');

    return redirect()->route('panel.transactions.index');
  }
}
