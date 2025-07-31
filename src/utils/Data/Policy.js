export const policies = [
    {
      id: 'veryFlexible',
      name: 'Very Flexible',
      description: [
        'Guests may cancel their Booking until 24 hours before the event start time and will receive a full refund (including all Fees) of their Booking Price.',
        'Booking cancellations submitted less than 24 hours before the Event start time are not refundable.',
      ],
    },
    {
      id: 'flexible',
      name: 'Flexible',
      description: [
        'Guests may cancel their Booking until 7 days before the event start time and will receive a full refund (including all Fees) of their Booking Price.',
        'Guests may cancel their Booking between 7 days and 24 hours before the event start time and receive a 50% refund (excluding Fees) of their Booking Price.',
        'Booking cancellations submitted less than 24 hours before the Event start time are not refundable.',
      ],
    },
    {
      id: 'standard30',
      name: 'Standard 30 day',
      description: [
        'Guests may cancel their Booking until 30 days before the event start time and will receive a full refund (including all Fees) of their Booking Price.',
        'Guests may cancel their Booking between 30 days and 7 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price.',
        'Cancellations submitted less than 7 days before the Event start time are not refundable.',
      ],
    },
    {
      id: 'standard90',
      name: 'Standard 90 day',
      description: [
        'Guests may cancel their Booking until 90 days before the event start time and will receive a full refund (including all Fees) of their Booking Price.',
        'Guests may cancel their Booking between 90 days and 14 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price.',
        'Cancellations submitted less than 14 days before the Event start time are not refundable.',
      ],
    },
  ];