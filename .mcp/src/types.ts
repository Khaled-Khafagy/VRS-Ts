export interface JiraIssue {
    key: string;
    summary: string;
    description: string;
    issueType: string;
    status: string;
    priority: string;
    assignee: string | null;
    reporter: string;
    acceptanceCriteria: string;
}

export interface TestStep {
    description: string;
    testData?: string;
    expectedResult: string;
}

export interface TestCase {
    name: string;
    objective: string;
    precondition?: string;
    priority: 'Low' | 'Normal' | 'High';
    steps: TestStep[];
    labels?: string[];
}

export interface CreatedTestCase {
    key: string;
    name: string;
    url: string;
}

export interface TestCycle {
    key: string;
    name: string;
    url: string;
}
