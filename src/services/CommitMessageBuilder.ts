import { InfixType, MessageWrapperType, PrefixType } from '../types';

export class CommitMessageBuilder {
    private readonly jiraIssue: string;
    private messageWrapper: MessageWrapperType = 'none';
    private prefix: PrefixType = 'none';
    private infix: InfixType = 'none';
    private conventionalCommitType: string | null = null;

    constructor(jiraIssue: string) {
        this.jiraIssue = jiraIssue;
    }

    withWrapper(wrapperType: MessageWrapperType): CommitMessageBuilder {
        this.messageWrapper = wrapperType;
        return this;
    }

    withPrefix(prefixType: PrefixType): CommitMessageBuilder {
        this.prefix = prefixType;
        return this;
    }

    withInfix(infixType: InfixType): CommitMessageBuilder {
        this.infix = infixType;
        return this;
    }

    withConventionalCommit(conventionalCommitType: string | null): CommitMessageBuilder {
        this.conventionalCommitType = conventionalCommitType;
        return this;
    }

    getCommitMessage(): string {
        if (!this.jiraIssue) {
            return '';
        }

        // Apply wrapper
        let wrappedIssue = this.jiraIssue;
        switch (this.messageWrapper) {
            case 'parentheses':
                wrappedIssue = `(${this.jiraIssue})`;
                break;
            case 'brackets':
                wrappedIssue = `[${this.jiraIssue}]`;
                break;
            case 'curly_brackets':
                wrappedIssue = `{${this.jiraIssue}}`;
                break;
            case 'backslash':
                wrappedIssue = `\\${this.jiraIssue}\\`;
                break;
        }

        // Apply prefix
        let prefixedIssue = wrappedIssue;
        switch (this.prefix) {
            case 'hash':
                prefixedIssue = `#${wrappedIssue}`;
                break;
            case 'colon':
                prefixedIssue = `:${wrappedIssue}`;
                break;
            case 'dash':
                prefixedIssue = `-${wrappedIssue}`;
                break;
        }

        // Apply infix
        let result = prefixedIssue;
        switch (this.infix) {
            case 'colon':
                result = `${prefixedIssue}:`;
                break;
            case 'colon_space':
                result = `${prefixedIssue}: `;
                break;
            case 'dash_space':
                result = `${prefixedIssue} - `;
                break;
        }

        // Apply conventional commit if available
        if (this.conventionalCommitType) {
            result = `${this.conventionalCommitType}(${this.jiraIssue}): `;
        }

        return result;
    }
} 