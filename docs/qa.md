Use two test accounts:
- Account A: brand-new user for the main lifecycle.
- Account B: separate user with a clearly identifiable private board and task.
The first two sections contain 23 manual scenarios and should take roughly 60–90 minutes. The final section is intentionally deferred.
1. Launch Blockers
1. Public entry and signup
- Scenario: New visitor creates an account.
- Steps: Open / signed out. Check the main layout and CTAs. Choose Get Started, complete email-code signup, and reload after authentication.
- Expected result: Landing page looks finished with no obvious layout or console errors. Signup succeeds once and routes the new user to /welcome. Reload keeps the session.
- Priority: Critical
2. First-time onboarding and first board
- Scenario: Create the first Personal board.
- Steps: On /welcome, select Personal, rename it Launch QA, and submit. Double-click the submit button once while it is processing. Inspect the board before refreshing, then refresh it.
- Expected result: Exactly one board is created with To Do, In Progress, and Done in that order. The four starter tasks appear immediately and remain exactly once after refresh. No permanent loading state appears.
- Priority: Critical
3. Bug Tracking template
- Scenario: Verify the advertised Bug Tracking template renders.
- Steps: Create a second board using Bug Tracking. Open it, refresh it, and try adding a task to the Reported column.
- Expected result: The board renders Reported, Testing, Under Review, and Done without an error boundary or console crash. All columns are usable.
- Priority: Critical
  Current source inspection indicates this is likely broken because Reported is missing from the status rendering map.
4. Custom board and column creation
- Scenario: Build a board from scratch.
- Steps: Create a Custom Workflow board. Add To Do, then immediately add In Progress. Refresh and create a task in each column.
- Expected result: Both columns exist once, preserve their order, and have valid persistent IDs. Neither column overwrites the other. Tasks remain in their selected columns after refresh.
- Priority: Critical
5. Failed column creation
- Scenario: Ensure a rejected column does not remain as a phantom.
- Steps: Open the Add Column form in one tab. Delete that board from a second tab. Return to the first tab and submit the column.
- Expected result: The column creation fails visibly and no temporary column remains. Refresh safely returns to the dashboard or not-found state.
- Priority: Critical
  Current source inspection indicates the returned-failure path may leave an unsaved column visible.
6. Task create and edit persistence
- Scenario: Create and edit a complete task.
- Steps: Create a high-priority task with a description. Open it, change its title, description, and priority, then refresh.
- Expected result: One task exists with the final values. The temporary task is replaced cleanly by the saved task, and the column count remains correct.
- Priority: Critical
7. Rapid task submission
- Scenario: Prevent accidental duplicate tasks.
- Steps: Under a slow-network preset, create a task and double-click submit or press Enter repeatedly. Repeat once with Quick Add.
- Expected result: One submit gesture creates one task. No duplicate card, temporary card, inflated count, or permanently disabled form remains.
- Priority: Critical
8. Task drag-and-drop ordering
- Scenario: Reorder and move tasks.
- Steps: Create three identifiable tasks. Move the last task to first within its column, then move it into another column between existing tasks. Refresh.
- Expected result: Exact order and destination persist. No task is duplicated or lost, and source/destination counts are correct.
- Priority: Critical
9. Drag cancellation and rollback
- Scenario: Cancel or fail an optimistic task move.
- Steps: Start dragging a task into another column and press Escape. Then repeat while offline and complete the drop. Restore the network and refresh.
- Expected result: Both cancelled and failed moves restore the original column, order, and counts. The drag overlay and pending state clear.
- Priority: Critical
10. Column reordering
- Scenario: Reorder populated columns.
- Steps: Move the last column to first, then move another column to the end. Refresh.
- Expected result: Column order persists exactly and tasks remain attached to their original columns.
- Priority: Critical
11. Column status and dashboard consistency
- Scenario: Change an active column to Done.
- Steps: First visit the dashboard to load its current counts. Return to the board and change a populated active column to Done. Revisit the dashboard and All Boards, then refresh both.
- Expected result: Tasks remain in the column, but Open Tasks and board-card counts immediately exclude them. All screens agree.
- Priority: High
  Current source inspection found a probable cache-invalidation gap here.
12. Task deletion
- Scenario: Cancel and confirm task deletion.
- Steps: Open Delete on a task and cancel. Open it again and confirm. Refresh and search for the deleted task.
- Expected result: Cancel changes nothing. Confirm removes only the selected task, decrements its count once, and keeps it deleted after refresh.
- Priority: Critical
13. Column deletion and cascade
- Scenario: Delete a column containing tasks.
- Steps: Start deletion and cancel. Repeat and confirm. Refresh, search for its tasks, and inspect neighboring columns.
- Expected result: Cancel preserves everything. Confirm deletes that column and all its tasks, while unrelated columns and tasks remain unchanged.
- Priority: Critical
14. Board deletion and cascade
- Scenario: Delete an active populated board.
- Steps: Cancel the first confirmation. Confirm the second attempt. Reopen its old URL and search for its tasks.
- Expected result: Cancel is harmless. Confirm returns to the dashboard and removes only that board, all its columns, and all its tasks. The old URL cannot expose deleted content.
- Priority: Critical
15. Search and task navigation
- Scenario: Search by title and description.
- Steps: From the dashboard, search for a board. Switch to Tasks and search for a task using its title and then a description-only phrase. Select it. Repeat from inside a board.
- Expected result: Workspace search finds only Account A’s records and opens the correct board/task. Board search remains limited to the current board. Editing a result is reflected in a new search.
- Priority: High
16. Refresh and full-session persistence
- Scenario: Verify the completed lifecycle survives a new session.
- Steps: Record the final board, column, and task order. Hard-refresh. Log out, close the tab, sign in again, and reopen the board.
- Expected result: All confirmed creates, edits, moves, ordering, and deletions persist exactly. Onboarding does not repeat.
- Priority: Critical
17. Anonymous access
- Scenario: Open private routes while signed out.
- Steps: Log out and directly open /dashboard, /dashboard/tasks, a saved board URL, and a saved task URL. Use browser Back after logout.
- Expected result: Authentication is required and no private board or task data is exposed or remains interactively usable.
- Priority: Critical
18. Cross-user data isolation
- Scenario: Ensure Account B cannot see Account A.
- Steps: In separate browser profiles, give both users a board with the same name but different private tasks. As B, open A-only board URLs and search for A’s unique board/task text. Repeat in reverse.
- Expected result: Each user sees only their own board for the shared slug. Foreign URLs, dashboard counts, Tasks lists, attention items, and searches reveal no other-user content.
- Priority: Critical
19. Same-browser account switching
- Scenario: Prevent client state leaking between accounts.
- Steps: As A, open a board, task modal, search, and priority filter. Log out and sign in as B in the same browser profile.
- Expected result: No A board, task, active modal, failed creation attempt, filter result, or temporary item appears for B.
- Priority: Critical
20. Mobile core workflow
- Scenario: Complete core board work on a phone-sized viewport.
- Steps: At approximately 390px wide, navigate with the sidebar, pan across columns, create and edit a task, move it using the menu, and open a delete confirmation. Test with the virtual keyboard visible if possible.
- Expected result: All controls remain reachable, dialogs fit and scroll, horizontal board navigation works, and no content or submit button is blocked.
- Priority: Critical
2. Core QA
21. Board create, rename, and duplicate name
- Scenario: Manage board identity safely.
- Steps: Create another board with a description. Rename it while open. Attempt to create or rename another board to the same normalized name. Refresh the new URL.
- Expected result: Rename updates the header, sidebar, breadcrumb, and URL without losing data. Duplicate slug is rejected without changing either board.
- Priority: High
22. Dashboard, Tasks page, and filters
- Scenario: Verify workspace summaries.
- Steps: Compare dashboard board/open-task counts with actual data. Open Tasks and switch between All, Needs attention, Stale, and High priority. Open a task from the list.
- Expected result: Counts are believable and update after mutations. Terminal-column tasks are excluded from open/attention totals. Task links focus the correct task in the correct board.
- Priority: High
23. Loading, empty, and simple failure recovery
- Scenario: Check visible reliability states.
- Steps: Under slow network, open the dashboard, a board, and search. Inspect a genuinely empty custom board and a no-results search. Go offline before creating or editing a task, then restore connectivity and retry.
- Expected result: Loading is distinguishable from empty data. Empty and no-results states are useful. Failed optimistic task changes roll back, show an error, and can be retried successfully.
- Priority: High
24. Browser navigation
- Scenario: Use Back, Forward, direct links, and refresh.
- Steps: Navigate dashboard → board → Tasks filter → focused task. Use Back and Forward. Paste a task URL into a new tab and refresh it.
- Expected result: URL, board title, visible tasks, filters, and breadcrumb remain synchronized. No previous board’s tasks appear under another board.
- Priority: High
25. Keyboard basics
- Scenario: Complete essential actions without a mouse.
- Steps: Tab through navigation and forms. Open a task with Enter. Use Ctrl/Cmd K for search. Use Space and arrow keys to move one task, then Escape to cancel another move.
- Expected result: Focus is visible, dialogs do not trap the user incorrectly, search works, keyboard drag persists correctly, and cancel restores the original position.
- Priority: High
3. Post-Launch / Automated Later
26. Deep pagination
- Scenario: Validate boards and columns containing more than one full page.
- Steps: Later automate 13+ boards and 45+ tasks, including filtered pages and off-page focused tasks.
- Expected result: No missing, duplicated, or incorrectly ordered records across pages.
- Priority: Post-launch
27. Overlapping mutation races
- Scenario: Run simultaneous creates, edits, drags, and deletes.
- Steps: Later automate delayed success/failure responses while another mutation completes or the user navigates away.
- Expected result: A failed operation never rolls back another successful operation or modifies the newly active board.
- Priority: Post-launch
28. Server Action authorization matrix
- Scenario: Submit foreign board, column, task, and ordering IDs directly.
- Steps: Later use controlled request-level tests under Accounts A and B, including cross-board task moves and incomplete column-order arrays.
- Expected result: Every unauthorized read or mutation is rejected atomically.
- Priority: Post-launch
29. Ambiguous response-loss recovery
- Scenario: Allow a mutation to commit but drop its response.
- Steps: Later test board, task, and destructive actions with a transport interception facility.
- Expected result: Board retry remains idempotent, and other operations reconcile without misleading duplicates or phantom records.
- Priority: Post-launch
30. Full accessibility and browser matrix
- Scenario: Formal assistive-technology and cross-browser audit.
- Steps: Later run NVDA/Firefox, VoiceOver/Safari, reduced motion, contrast checks, real iOS/Android touch dragging, and wider browser coverage.
- Expected result: Core workflows remain perceivable and operable across supported environments.
- Priority: Post-launch
I did not modify the repository, install Playwright, or write automated tests.
