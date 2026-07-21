<?php

namespace App\Services\Transactions;

use App\Repositories\Transactions\TransactionRepository;
use App\Actions\Transactions\VerifyTransaction;
use App\Actions\Transactions\RejectTransaction;
use App\Actions\Transactions\DeleteTransaction;
use App\Enums\TransactionStatus;
use App\Mail\CompetitionRegisteredMail;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Services\MailService;

class TransactionService
{
  public function __construct(
    protected TransactionRepository $transactionRepository,
    protected VerifyTransaction $verifyTransaction,
    protected RejectTransaction $rejectTransaction,
    protected MailService $mailService,
    protected DeleteTransaction $deleteTransaction,
  ) {}

  public function index(array $queryParams)
  {
    $cleanParams = [
      'search'  => $queryParams['search'] ?? null,
      'filters' => [
        'status' => $queryParams['filters']['status'] ?? null,
      ],
    ];

    return $this->transactionRepository->index($cleanParams);
  }

  public function verify(Transaction $transaction, bool $notifyEmail = false)
  {
    DB::transaction(function () use ($transaction) {
      $this->verifyTransaction->handle($transaction);
    });

    if ($notifyEmail) {
      $this->mailService->send(new CompetitionRegisteredMail(
        team_name: $transaction->team->team_name,
        competition_type: $transaction->team->competition->type,
        competition_name: $transaction->team->competition->name,
        leader_name: $transaction->team->leader->name,
        transaction_status: TransactionStatus::verified->value,
      ), $transaction->team->leader->email);
    }
  }

  public function reject(Transaction $transaction, bool $notifyEmail = false)
  {
    DB::transaction(function () use ($transaction) {
      $this->rejectTransaction->handle($transaction);
    });

    if ($notifyEmail) {
      $this->mailService->send(new CompetitionRegisteredMail(
        team_name: $transaction->team->team_name,
        competition_type: $transaction->team->competition->type,
        competition_name: $transaction->team->competition->name,
        leader_name: $transaction->team->leader->name,
        transaction_status: TransactionStatus::rejected->value,
      ), $transaction->team->leader->email);
    }
  }

  public function destroy(Transaction $transaction): bool
  {
    return DB::transaction(function () use ($transaction) {
      return $this->deleteTransaction->handle($transaction);
    });
  }
}
