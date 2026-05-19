<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Models\Transaction;
use App\Resources\Transactions\IndexTransactionResource;
use App\Resources\Transactions\ShowTransactionResource;
use App\Services\Transactions\TransactionService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
  public function __construct(
    protected TransactionService $transactionService,
  ) {}

  public function index(Request $request)
  {
    $this->authorize('viewAny', Transaction::class);

    $transactions = $this->transactionService->index($request);

    return $this->render('panel/transactions/index', [
      'transactions' => IndexTransactionResource::collection($transactions),
    ]);
  }

  public function create()
  {
    $this->authorize('create', Transaction::class);

    return $this->render('panel/transactions/create');
  }

  public function store(StoreTransactionRequest $request)
  {
    $this->transactionService->create($request->toDTO());

    $this->flash('success', 'Transaction created successfully.');

    return redirect()->route('transactions.index');
  }

  public function show(Transaction $transaction)
  {
    $this->authorize('view', $transaction);

    return $this->render('panel/transactions/show', [
      'transaction' => ShowTransactionResource::make($transaction)->resolve(),
    ]);
  }

  public function destroy(Transaction $transaction)
  {
    $this->authorize('delete', $transaction);

    $this->transactionService->destroy($transaction);

    $this->flash('success', 'Transaction deleted successfully.');

    return redirect()->route('transactions.index');
  }
}
