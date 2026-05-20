<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Resources\Transactions\IndexTransactionResource;
use App\Resources\Transactions\ShowTransactionResource;
use App\Services\Competitions\CompetitionService;
use App\Services\Transactions\TransactionService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
  public function __construct(
    protected TransactionService $transactionService,
    protected CompetitionService $competitionService,
  ) {}

  public function index(Request $request)
  {
    $this->authorize('viewAny', Transaction::class);

    $transactions = $this->transactionService->index($request);

    return $this->render('panel/transactions/index', [
      'transactions' => IndexTransactionResource::collection($transactions),
    ]);
  }

  // Transaction creation is handled by the user-facing controller, so we don't need create/store methods here.
  // public function create()
  // {
  //   $this->authorize('create', Transaction::class);

  //   return $this->render('panel/transactions/create', [
  //     'competitionMap' => $this->competitionService->getCompetitionMap(),
  //   ]);
  // }

  // public function store(StoreTransactionRequest $request)
  // {
  //   $this->transactionService->create($request->toDTO());

  //   $this->flash('success', 'Transaction created successfully.');

  //   return redirect()->route('transactions.index');
  // }

  public function show(Transaction $transaction)
  {
    $this->authorize('view', $transaction);

    return $this->render('panel/transactions/show', [
      'transaction' => ShowTransactionResource::make($transaction)->resolve(),
    ]);
  }

  public function verify(Transaction $transaction)
  {
    $this->authorize('update', $transaction);

    $transaction->status = 'verified';
    $transaction->save();

    // TODO: if verified, make the maded team's cannot commit to other competition again.

    $this->flash('success', 'Transaction verified successfully.');

    return redirect()->route('transactions.index');
  }

  public function reject(Transaction $transaction)
  {
    $this->authorize('update', $transaction);

    $transaction->status = 'rejected';
    $transaction->save();

    // TODO: if rejected, delete the payment proof file from storage and update the transaction record to remove the file path
    // And make the maded team's can commit to other competition again.

    $this->flash('success', 'Transaction rejected successfully.');

    return redirect()->route('transactions.index');
  }

  public function destroy(Transaction $transaction)
  {
    $this->authorize('delete', $transaction);

    $this->transactionService->destroy($transaction);

    $this->flash('success', 'Transaction deleted successfully.');

    return redirect()->route('transactions.index');
  }
}
