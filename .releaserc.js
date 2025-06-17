const commitGroupsOrder = [
  "features",
  "performance",
  "bugfixes",
  "tests",
  "refactoring",
  "documentation",
  "dependencies",
];

module.exports = {
  branches: ["main", "staging"],
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "chore", scope: "deps", section: "Dependencies" },
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "test", section: "Tests" },
            { type: "docs", section: "Documentation" },
            { type: "refactor", section: "Refactoring" },
            { type: "perf", section: "Performance" },
          ],
        },
        writerOpts: {
          groupBy: "type",
          commitGroupsSort: (commitGroupA, commitGroupB) => {
            const commitGroupATitle = commitGroupA.title.replace(/[^a-zA-Z]/gu, "").toLowerCase();
            const commitGroupBTitle = commitGroupB.title.replace(/[^a-zA-Z]/gu, "").toLowerCase();

            const commitGroupAIndex = commitGroupsOrder.indexOf(commitGroupATitle);
            const commitGroupBIndex = commitGroupsOrder.indexOf(commitGroupBTitle);

            return commitGroupAIndex - commitGroupBIndex;
          },
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        failComment: false,
        successComment: false,
        releasedLabels: ["published"],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "pnpm-lock.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/exec",
      {
        verifyReleaseCmd: 'echo "version=${nextRelease.version}" >> $GITHUB_OUTPUT',
      },
    ],
  ],
};
