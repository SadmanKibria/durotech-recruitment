# Contributing to Durotech Recruitment Website

Thank you for your interest in contributing to the Durotech Recruitment website.

## Development Setup

1. Fork the repository
2. Clone your fork locally
3. Follow the setup instructions in README.md
4. Create a new branch for your feature/fix
5. Make your changes
6. Test thoroughly
7. Submit a pull request

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Keep components focused and single-purpose
- Use proper TypeScript types for props

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### Naming Conventions
- Components: PascalCase (e.g., `ApplicationForm`)
- Files: kebab-case (e.g., `application-form.tsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `APPLICATION_STATUSES`)

## Git Commit Messages

Follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

Example: `feat: add payment tracking to admin dashboard`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README.md with any new environment variables
5. Request review from maintainers

## Testing

Before submitting a PR:
- Test all modified functionality
- Check responsive design on mobile/tablet/desktop
- Verify no console errors
- Test with different admin roles if applicable

## Questions?

Contact: info@durotech.co.uk

Thank you for contributing!
