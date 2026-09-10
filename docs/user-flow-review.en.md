# KanbanFlow: User Flow Review

The main flow makes sense: visit the homepage → sign up or sign in → create a board → manage tasks → return later.

This report explains what needs fixing and what we could improve. These are proposals for discussion, not changes already made.

**Review scope:** Based on the local code reviewed on September 9, 2026. The live signup flow and mobile layout have not been tested. Possible issues are marked below.

## 1. Homepage

The landing page is a good starting point. Keep it.

### 1.1 Show a real preview

- **Issue:** The homepage references a screenshot that is missing from the local files. Its fallback contains developer instructions.
- **Why it matters:** The visitor may see an unfinished preview instead of the product.
- **Suggestion:** Add a real board screenshot with sample tasks. Clearly describe the app as a personal task manager.
- **Recommendation:** Fix before sharing the app publicly.

### 1.2 Help returning users get back to work

- **Issue:** The homepage shows Sign In and Sign Up even when the user is already signed in.
- **Why it matters:** Returning users do not have a clear shortcut to their boards.
- **Suggestion:** Show “Go to dashboard” for signed-in users.
- **Recommendation:** Implement. This is a small, useful improvement.

### 1.3 Let visitors try the app without an account

- **Opportunity:** Visitors currently need an account to try the main features.
- **Why it matters:** Someone reviewing your portfolio may leave before trying the board.
- **Suggestion:** Add a demo board with sample tasks, editing, drag-and-drop, and a Reset button. Clearly explain that demo data is local and temporary.
- **Recommendation:** Optional. Add after fixing the core flow.

## 2. Signup and Sign-in

Having both signup and sign-in is appropriate. The experience needs to be consistent.

### 2.1 Choose a consistent login method

- **Issue:** Signup asks for a password, but the implemented sign-in screen uses an email code.
- **Why it matters:** Users may wonder why they created a password they cannot use on that screen.
- **Suggestion:** Choose one consistent approach: email codes, or passwords with password recovery. Match the authentication settings to the screens. Fix wording that says “verification link” when the screen expects a code, and allow users to correct their email.
- **Recommendation:** Decide before launch. I suggest email codes with social login, subject to checking the current authentication settings.

### 2.2 Fix “Resend code” during signup

- **Issue:** The signup screen uses a resend action intended for sign-in. The mismatch is visible in the code; its runtime effect still needs testing.
- **Why it matters:** A user who does not receive the first code could get stuck.
- **Suggestion:** Use the correct resend action for each flow. Test resending, expired codes, and incorrect codes.
- **Recommendation:** Fix and test before launch.

## 3. Creating the First Board

Templates and sample tasks already exist. They are useful starting points.

### 3.1 Make sure the first board saves completely

- **Possible issue:** Account setup, board creation, and sample-task creation are not guaranteed to finish together. A slow or failed operation could leave an incomplete result.
- **Why it matters:** A user's first attempt could fail or show an error after part of the board was saved.
- **Suggestion:** Ensure the account is ready first. Save the board and its initial data together, and make retrying safe.
- **Recommendation:** Address before launch. Test with slow requests and deliberate failures.

### 3.2 Show success only when retrying actually works

- **Issue:** The board retry code can take the success path even when no successful board result was returned.
- **Why it matters:** Users could see a success message without a usable board.
- **Suggestion:** Check the saved result before showing success. Keep clear Retry and Back options on failure.
- **Recommendation:** Fix before launch.

### 3.3 Make the first steps easier to understand

- **Possible issue:** Sample tasks may not appear immediately when creation is slow. They can also be added again after a returning user deletes all their boards.
- **Why it matters:** The first board may look incomplete, or sample tasks may return unexpectedly.
- **Suggestion:** Show all saved data immediately after creation and track first use correctly. Optionally recommend a template and let users choose whether to include sample tasks.
- **Recommendation:** Fix the data behavior. Discuss the optional onboarding changes separately.

### 3.4 Guide users who start with an empty board

- **Issue:** A board without columns still offers task creation, but the task form requires a column.
- **Why it matters:** Users can open a form they cannot complete.
- **Suggestion:** Show “Add your first column” before offering task creation.
- **Recommendation:** Fix before public release.

## 4. Everyday Use

Task creation, priorities, dates, search, and drag-and-drop are already available.

### 4.1 Make task details easier to open

- **Issue:** Users must go through the edit menu to read full task details.
- **Why it matters:** Reading a long description takes extra steps.
- **Suggestion:** Open task details when the user clicks the task title.
- **Recommendation:** Useful improvement after core fixes.

### 4.2 Offer a simple alternative to dragging

- **Opportunity:** Moving tasks relies on drag-and-drop, which already includes keyboard support.
- **Why it matters:** Some users may find a direct column choice easier, especially on mobile.
- **Suggestion:** Add “Move to column” to the task menu or form.
- **Recommendation:** Useful, but can be deferred.

### 4.3 Protect against accidental deletion

- **Issue:** Deleting a task happens immediately, without confirmation or an Undo option for successful deletion.
- **Why it matters:** An accidental click can remove useful content.
- **Suggestion:** Add a simple confirmation. A working Undo feature is another option. When deleting a column, explain that its tasks will also be deleted.
- **Recommendation:** Implement confirmation first. Consider Undo later.

### 4.4 Keep search results and board pages clear

- **Issue:** An out-of-range board page can say there are no boards even when boards exist.
- **Possible issue:** During fast typing, an older search response may arrive after a newer one and replace it.
- **Why it matters:** Users could think their data is missing or see results for the wrong query.
- **Suggestion:** Redirect invalid page numbers to a valid page. Accept only the latest search response. Distinguish loading failures from empty results.
- **Recommendation:** Fix pagination and test search timing before release.

### 4.5 Make overdue tasks easy to spot

- **Issue:** Due dates appear as ordinary dates without a clear overdue label.
- **Why it matters:** Users must compare dates themselves to find tasks needing attention.
- **Suggestion:** Add labels such as “Today” and “Overdue.” Check that dates remain correct across time zones.
- **Recommendation:** Useful improvement after core fixes.

## 5. Account and Mobile Experience

### 5.1 Connect the account menu and logout button

- **Issue:** The sidebar displays a fixed name, email, and picture. Logout is not connected to an action. Other entries, such as billing and upgrades, are also inactive.
- **Why it matters:** Users see someone else's identity and controls that do nothing.
- **Suggestion:** Show the actual user's details, connect account management and logout, and remove unavailable menu items. Verify that switching accounts does not show the previous account's data.
- **Recommendation:** Fix first.

### 5.2 Test the mobile experience

- **Possible issue:** Some welcome cards and board controls may become crowded on small screens. No visual bug has been confirmed yet.
- **Why it matters:** Important buttons could become difficult to reach or use.
- **Suggestion:** Test small screens, touch scrolling, dragging, keyboard navigation, and zoom. Fix the problems that appear.
- **Recommendation:** Test before launch. Do not redesign without evidence.

### 5.3 Make product promises match available features

- **Issue:** The text mentions features such as exports and public boards, but no matching user flow was found. Account deletion also needs checking to ensure app data is handled correctly.
- **Why it matters:** Users may expect features or data controls they cannot find.
- **Suggestion:** Correct the text, provide a clear contact and data-deletion path, and test account deletion. Treat data export as a separate feature decision.
- **Recommendation:** Correct the text and verify deletion before public release. Export can be discussed later.

## 6. Presenting the Project for Job Applications

### 6.1 Make your work easy to evaluate

- **Opportunity:** The app link alone does not explain the engineering behind the product.
- **Why it matters:** Reviewers may miss your work on permissions, saving data, and handling failures.
- **Suggestion:** Add a short demo video, a direct repository link, and a brief explanation of your main technical decisions. Update the README with real screenshots and verified test results.
- **Recommendation:** Do this after fixing the core journey. A guest demo would also help.

Avoid expanding into team collaboration, payments, or other large features for now. Focus on completing and demonstrating the existing app.

## Suggested Order

1. Fix account details and logout — **5.1**.
2. Fix code resending and choose the login method — **2.1–2.2**.
3. Make first-board creation and retry reliable — **3.1–3.2**.
4. Fix the homepage preview and empty-board flow — **1.1 and 3.4**.
5. Test mobile, search, account switching, and data deletion.
6. Choose the remaining usability and portfolio improvements.

For each item, we can decide: **implement, defer, or change the proposal**.

## Checks Already Run

- TypeScript check: passed.
- Lint: failed with one error in `src/hooks/use-mobile.ts:14`. Fix before release.
- Live account flows, browser interactions, mobile layout, and a production build were not tested during this review.

The [original technical report](user-flow-review.ar.md) contains the supporting file references and more detailed acceptance checks.
