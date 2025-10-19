# Development Workflow

## When a Task is Completed

### Code Quality Checks (Required)
1. **Run ESLint**: `npm run lint`
   - Fix any linting issues with `npm run lint:fix`
   - Ensure all ESLint rules pass

2. **Format Code**: `npm run format`
   - Apply Prettier formatting to all files
   - Consistent code style is enforced via pre-commit hooks

3. **Run Tests**: `npm run test:run`
   - Ensure all existing tests pass
   - Add new tests if functionality was modified

### Build Verification
1. **Build Project**: `npm run build`
   - Verify production build succeeds
   - Check for any TypeScript compilation errors
   - Ensure RSS generation works correctly

### Pre-commit Process
- Husky automatically runs `lint-staged` on commit
- This includes ESLint and Prettier checks
- Fix any issues before committing

## Task Completion Checklist
- [ ] Code follows TypeScript conventions (when used)
- [ ] ESLint passes without errors
- [ ] Code is formatted with Prettier
- [ ] Tests pass (if applicable)
- [ ] Build succeeds
- [ ] No console errors or warnings
- [ ] Functionality works as expected

## Testing Strategy
- Unit tests for utility functions in `src/test/`
- Component tests for React components using React Testing Library
- Integration tests for API endpoints if needed
- Manual testing for UI components and user flows

## Deployment Considerations
- Environment variables are properly configured
- Notion API integration works correctly
- RSS feed generation completes successfully
- Static assets are optimized and accessible
- Incremental Static Revalidation (ISR) functions properly