# Changelog

## [Unreleased] — GitHub publication

### Changed
- Опубликован на GitHub: `github:zhenek73/wharfkit-wallet-properwallet`
- WebDEX переключён с `file:` ссылки на GitHub зависимость

## [Unreleased] — sign() via signTransaction

### Changed
- sign() теперь вызывает provider.signTransaction() вместо provider.transact()
- signTransaction() возвращает { signatures: string[] } без broadcast
- Добавлены логи [ProperWallet] provider detected / login success / sign success

### Fixed
- sign() больше не делает broadcast транзакции
- WharfKit корректно получает signatures для самостоятельного broadcast
