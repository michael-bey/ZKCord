# Security

ZKCord decides who gets roles based on passport proofs, so bugs that let someone get a role they haven't
proven, verify one passport on several accounts, or see data they shouldn't are security issues.

## Reporting a vulnerability

Don't open a public issue. Use GitHub's private reporting instead: **Security → Report a vulnerability** on
this repository. Include what an attacker can do, steps to reproduce, and the commit or deployment you tested.

Issues in the ZKPassport app, SDK or proof circuits should go to [ZKPassport](https://zkpassport.id) directly.

## Scope

In scope: this repository's code and the hosted instance at zkcord.vercel.app. Please don't test against
Discord servers you don't run, or attempt denial of service.
