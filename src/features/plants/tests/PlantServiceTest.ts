import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlantForm } from '../components/PlantForm';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('PlantForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders form fields correctly', () => {
    render(
      <PlantForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/plant name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scientific name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
    expect(screen.getByText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/care instructions/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <PlantForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add plant/i });
    await user.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/scientific name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/thumbnail url is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates URL format', async () => {
    const user = userEvent.setup();
    
    render(
      <PlantForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const thumbnailInput = screen.getByLabelText(/thumbnail url/i);
    await user.type(thumbnailInput, 'invalid-url');

    const submitButton = screen.getByRole('button', { name: /add plant/i });
    await user.click(submitButton);

    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <PlantForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText(/plant name/i), 'Test Plant');
    await user.type(screen.getByLabelText(/scientific name/i), 'Testus plantus');
    await user.type(screen.getByLabelText(/thumbnail url/i), 'https://example.com/test.jpg');

    const submitButton = screen.getByRole('button', { name: /add plant/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Plant',
        scientificName: 'Testus plantus',
        thumbnail: 'https://example.com/test.jpg',
        tags: [],
        description: '',
        careInstructions: '',
      });
    });
  });

  test('adds and removes tags', async () => {
    const user = userEvent.setup();
    
    render(
      <PlantForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const tagInput = screen.getByPlaceholderText(/add a tag/i);
    const addButton = screen.getByRole('button', { name: '' }); // Plus button

    await user.type(tagInput, 'houseplant');
    await user.click(addButton);

    expect(screen.getByText('houseplant')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: '' }); // X button in badge
    await user.click(removeButton);

    expect(screen.queryByText('houseplant')).not.toBeInTheDocument();
  });
});