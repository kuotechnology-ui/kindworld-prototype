import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VerificationRequestReview from '../VerificationRequestReview'
import { VerificationRequest } from '../../types/verification'

// Mock the ConfirmationDialog component
vi.mock('../ConfirmationDialog', () => ({
  default: ({ isOpen, title, onConfirm, onCancel }: any) => 
    isOpen ? (
      <div data-testid="confirmation-dialog">
        <h3>{title}</h3>
        <button onClick={onConfirm} data-testid="confirm-button">Confirm</button>
        <button onClick={onCancel} data-testid="cancel-button">Cancel</button>
      </div>
    ) : null
}))

const mockRequest: VerificationRequest = {
  id: 'test-request-1',
  ngoId: 'ngo-123',
  organizationName: 'Test NGO',
  organizationType: 'Non-Profit',
  contactEmail: 'contact@testngo.org',
  contactPhone: '+1234567890',
  website: 'https://testngo.org',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'Test Country'
  },
  missionStatement: 'Our mission is to test verification systems.',
  documents: [
    {
      id: 'doc-1',
      type: 'registration',
      fileName: 'registration.pdf',
      fileUrl: 'https://example.com/registration.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      uploadedAt: new Date('2023-01-01'),
      description: 'Organization registration document'
    }
  ],
  status: 'pending',
  submittedAt: new Date('2023-01-01')
}

describe('VerificationRequestReview', () => {
  const mockOnApprove = vi.fn()
  const mockOnReject = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render organization information correctly', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    expect(screen.getAllByText('Test NGO')[0]).toBeInTheDocument()
    expect(screen.getByText('Non-Profit')).toBeInTheDocument()
    expect(screen.getByText('contact@testngo.org')).toBeInTheDocument()
    expect(screen.getByText('Our mission is to test verification systems.')).toBeInTheDocument()
  })

  it('should display documents with correct information', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('registration.pdf')).toBeInTheDocument()
    expect(screen.getByText('Registration • 1000 KB')).toBeInTheDocument()
    expect(screen.getByText('Organization registration document')).toBeInTheDocument()
  })

  it('should show action buttons for pending requests', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Reject Request')).toBeInTheDocument()
    expect(screen.getByText('Approve Request')).toBeInTheDocument()
  })

  it('should not show action buttons for non-pending requests', () => {
    const approvedRequest = { ...mockRequest, status: 'approved' as const }
    
    render(
      <VerificationRequestReview
        request={approvedRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    expect(screen.queryByText('Reject Request')).not.toBeInTheDocument()
    expect(screen.queryByText('Approve Request')).not.toBeInTheDocument()
  })

  it('should open approve form when approve button is clicked', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    fireEvent.click(screen.getByText('Approve Request'))
    expect(screen.getByText('Approve Verification Request')).toBeInTheDocument()
  })

  it('should open reject form when reject button is clicked', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    fireEvent.click(screen.getByText('Reject Request'))
    expect(screen.getByText('Reject Verification Request')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    // The close button doesn't have accessible text, so we'll find it by its position
    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons.find(button => 
      button.className.includes('text-gray-400') && 
      button.querySelector('svg')
    )
    
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton!)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle document download', () => {
    // Mock fetch for document download
    global.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['test content']))
    })

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url')
    global.URL.revokeObjectURL = vi.fn()

    render(
      <VerificationRequestReview
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/registration.pdf')
  })

  it('should format file size correctly', () => {
    const requestWithLargeFile = {
      ...mockRequest,
      documents: [{
        ...mockRequest.documents[0],
        fileSize: 5242880 // 5MB
      }]
    }

    render(
      <VerificationRequestReview
        request={requestWithLargeFile}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onClose={mockOnClose}
      />
    )

    // Just check that MB is displayed somewhere, indicating file size formatting
    expect(screen.getByText(/MB/)).toBeInTheDocument()
  })
})