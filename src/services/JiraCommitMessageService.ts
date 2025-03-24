import * as vscode from 'vscode';
import { CommitMessageBuilder } from './CommitMessageBuilder';
import { InfixType, MessageWrapperType, PrefixType } from '../types';

export class JiraCommitMessageService {
    private readonly DEFAULT_REGEX_FOR_JIRA_PROJECT_ISSUES = '([A-Z]+[-_][0-9]+)';
    private readonly CONVENTIONAL_COMMITS_REGEX = '(feat|fix|build|ci|chore|docs|perf|refactor|style|test)(?:[/\\-]|$)';

    getCommitMessageFromBranchName(branchName: string | undefined): string {
        if (!branchName) {
            return '';
        }

        console.log(`Processing branch name: ${branchName}`);

        const config = vscode.workspace.getConfiguration('jiraCommitMessage');
        const isAutoDetectProjectKey = config.get<boolean>('autoDetectProjectKey', true);
        const jiraProjectKeys = config.get<string[]>('jiraProjectKeys', []);
        const isConventionalCommit = config.get<boolean>('isConventionalCommit', false);

        console.log(`Config: autoDetect=${isAutoDetectProjectKey}, conventionalCommit=${isConventionalCommit}, projectKeys=${jiraProjectKeys.join(',')}`);

        if (!isAutoDetectProjectKey && jiraProjectKeys.length === 0) {
            vscode.window.showWarningMessage(
                'Please configure your JIRA project key in the extension settings.',
                'Open Settings'
            ).then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'jiraCommitMessage');
                }
            });

            return '';
        }

        // First extract conventional commit type (if enabled and exists in branch name)
        const conventionalCommitType = this.extractConventionalCommitType(isConventionalCommit, branchName);
        console.log(`Found conventional commit type: ${conventionalCommitType}`);

        // Then extract JIRA issue
        const jiraIssue = this.extractJiraIssueFromBranch(isAutoDetectProjectKey, branchName, jiraProjectKeys);
        if (!jiraIssue) {
            console.log(`No JIRA issue found in branch: ${branchName}`);
            return '';
        }
        console.log(`Found JIRA issue: ${jiraIssue}`);

        // Get configuration for formatting
        const messageWrapperType = config.get<MessageWrapperType>('messageWrapperType', 'none');
        const messagePrefixType = config.get<PrefixType>('messagePrefixType', 'none');
        const messageInfixType = config.get<InfixType>('messageInfixType', 'none');

        // Always prioritize conventional commit if enabled and found
        if (isConventionalCommit && conventionalCommitType) {
            const commitMessage = `${conventionalCommitType}(${jiraIssue}): `;
            console.log(`Generated conventional commit message: ${commitMessage}`);
            return commitMessage;
        }

        // Otherwise use normal formatting
        const commitMessage = new CommitMessageBuilder(jiraIssue)
            .withWrapper(messageWrapperType)
            .withPrefix(messagePrefixType)
            .withInfix(messageInfixType)
            .getCommitMessage();

        console.log(`Generated standard commit message: ${commitMessage}`);
        return commitMessage;
    }

    private extractJiraIssueFromBranch(
        isAutoDetectProjectKey: boolean,
        branchName: string,
        jiraProjectKeys: string[]
    ): string | null {
        let jiraIssue: string | null = null;

        if (isAutoDetectProjectKey) {
            const pattern = new RegExp(this.DEFAULT_REGEX_FOR_JIRA_PROJECT_ISSUES);
            const matches = branchName.match(pattern);
            jiraIssue = matches ? matches[0] : null;
        } else {
            for (const projectKey of jiraProjectKeys) {
                const pattern = this.createPatternRegex(projectKey);
                let matches = branchName.match(pattern);

                if (!matches) {
                    const lowercasePattern = this.createPatternRegex(projectKey.toLowerCase());
                    matches = branchName.match(lowercasePattern);
                }

                if (matches) {
                    jiraIssue = matches[0].toUpperCase();
                    break;
                }
            }
        }

        return jiraIssue;
    }

    private createPatternRegex(projectKey: string): RegExp {
        return new RegExp(`${projectKey}[-_][0-9]+`, 'i');
    }

    private extractConventionalCommitType(isConventionalCommit: boolean, branchName: string): string | null {
        if (!isConventionalCommit) {
            return null;
        }
        
        console.log(`Trying to extract conventional commit type from: ${branchName}`);
        
        // This regex will match conventional commit prefixes at the start of the branch name
        // or after common branch prefix patterns like feature/, bugfix/, etc.
        const pattern = new RegExp(this.CONVENTIONAL_COMMITS_REGEX);
        const matches = branchName.match(pattern);
        
        if (matches && matches[1]) {
            console.log(`Matched conventional commit type: ${matches[1]}`);
            return matches[1];
        }
        
        // Special case for your specific branch pattern: if branch starts with "feat/"
        if (branchName.startsWith('feat/')) {
            console.log(`Special case - branch starts with feat/`);
            return 'feat';
        }
        
        return null;
    }
} 