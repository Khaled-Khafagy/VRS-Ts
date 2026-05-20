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
    projectKey: string;
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

/** Format returned by Claude's generate_test_cases tool */
export interface GeneratedTestCase {
    title: string;
    type: 'positive' | 'negative' | 'edge';
    steps: string[];
    expected_result: string;
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

export interface TestPlan {
    key: string;
    name: string;
    url: string;
}

export interface ZephyrFolder {
    id: string;
    name: string;
    path: string;
    parentId?: string;
    children: ZephyrFolder[];
}
