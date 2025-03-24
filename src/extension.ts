import * as vscode from 'vscode';
import { JiraCommitMessageService } from './services/JiraCommitMessageService';

// Interface for Git repository
interface GitRepository {
    state: {
        HEAD?: {
            name?: string;
        };
        onDidChange: (callback: () => void) => void;
    };
    inputBox: vscode.SourceControlInputBox;
}

// Basic GitService implementation
class GitService {
    async getCurrentBranchName(): Promise<string | undefined> {
        try {
            const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
            if (gitExtension) {
                const gitApi = gitExtension.getAPI(1);
                if (gitApi.repositories.length > 0) {
                    const repository = gitApi.repositories[0];
                    return repository.state.HEAD?.name;
                }
            }
            return undefined;
        } catch (error) {
            console.error('Error getting current branch name:', error);
            return undefined;
        }
    }

    getSourceControlInputBox(): vscode.SourceControlInputBox | undefined {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        if (gitExtension) {
            const gitApi = gitExtension.getAPI(1);
            if (gitApi.repositories.length > 0) {
                return gitApi.repositories[0].inputBox;
            }
        }
        return undefined;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('JIRA Commit Message extension is now active!');
    
    const gitService = new GitService();
    const jiraCommitMessageService = new JiraCommitMessageService();

    // Register the command to insert JIRA ID
    const insertCommand = vscode.commands.registerCommand('jira-commit-message.insertJiraId', async () => {
        const branchName = await gitService.getCurrentBranchName();
        if (!branchName) {
            vscode.window.showWarningMessage('Could not detect current Git branch');
            return;
        }

        console.log(`Branch name detected: ${branchName}`);

        // Get commit message from branch name
        const commitMessage = jiraCommitMessageService.getCommitMessageFromBranchName(branchName);
        if (!commitMessage) {
            vscode.window.showInformationMessage('No JIRA issue found in branch name');
            return;
        }

        console.log(`Generated commit message: ${commitMessage}`);

        // Get the SCM input box
        const scmInputBox = gitService.getSourceControlInputBox();
        if (scmInputBox) {
            const isPrependJiraIssueOnActionClick = vscode.workspace
                .getConfiguration('jiraCommitMessage')
                .get('prependJiraIssueOnActionClick', false);

            if (isPrependJiraIssueOnActionClick) {
                // Prepend to existing message
                scmInputBox.value = `${commitMessage}${scmInputBox.value}`;
            } else {
                // Replace message
                scmInputBox.value = commitMessage;
            }
        } else {
            vscode.window.showWarningMessage('Could not find Git SCM input box');
        }
    });

    // Handle Git repository events
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (gitExtension) {
        const gitApi = gitExtension.getAPI(1);
        
        // Auto-populate commit message when repository changes
        gitApi.onDidOpenRepository(async (repository: GitRepository) => {
            const branchName = await gitService.getCurrentBranchName();
            if (!branchName) {
                return;
            }

            const commitMessage = jiraCommitMessageService.getCommitMessageFromBranchName(branchName);
            if (commitMessage) {
                const scmInputBox = gitService.getSourceControlInputBox();
                if (scmInputBox && scmInputBox.value === '') {
                    scmInputBox.value = commitMessage;
                }
            }
        });

        // Listen to branch changes
        gitApi.repositories.forEach((repository: GitRepository) => {
            repository.state.onDidChange(async () => {
                const branchName = await gitService.getCurrentBranchName();
                if (!branchName) {
                    return;
                }

                const commitMessage = jiraCommitMessageService.getCommitMessageFromBranchName(branchName);
                if (commitMessage) {
                    const scmInputBox = gitService.getSourceControlInputBox();
                    if (scmInputBox && scmInputBox.value === '') {
                        scmInputBox.value = commitMessage;
                    }
                }
            });
        });
    }

    context.subscriptions.push(insertCommand);
}

export function deactivate() {} 