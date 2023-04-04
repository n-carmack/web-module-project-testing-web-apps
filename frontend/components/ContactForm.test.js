import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);
        const headerElement = screen.queryByText(/contact form/i);
            expect(headerElement).toBeInTheDocument();
            expect(headerElement).toBeTruthy();
            expect(headerElement).toHaveTextContent(/contact form/i);
        
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
        const firstName = screen.getByLabelText(/first name*/i);
        userEvent.type(firstName, "<5");

        const errorMessage = await screen.findAllByTestId('error');
        expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
        const submit = screen.getByRole('button');
        userEvent.click(submit);

        const errorMessage = await screen.findAllByTestId('error');
        expect(errorMessage).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
        const firstName = screen.getByLabelText(/first name*/i);
        userEvent.type(firstName, "Nicholas");

        const lastName = screen.getByLabelText(/last name*/i);
        userEvent.type(lastName, "Carmack");

        const submit = screen.getByRole('button');
        userEvent.click(submit);

        const errorMessage = await screen.findAllByTestId('error');
        expect(errorMessage).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
        const email = screen.getByLabelText(/email*/i);
        userEvent.type(email, '@');

        const errorMessage = await screen.findByText(/email must be a valid email address/i);
        expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
        const submit = screen.getByRole('button');
        userEvent.click(submit);

        const errorMessage = await screen.findByText(/lastName is a required field/i);
        expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
        const firstName = screen.getByLabelText(/first name*/i);
        userEvent.type(firstName, "Nicholas");

        const lastName = screen.getByLabelText(/last name*/i);
        userEvent.type(lastName, "Carmack");

        const email = screen.getByLabelText(/email*/i);
        userEvent.type(email, 'email@email.com');

        const submit = screen.getByRole('button');
        userEvent.click(submit);

        await waitFor(()=> {
            const firstnameDisplay = screen.getByText(/Nicholas/i);
            const lastnameDisplay = screen.getByText(/Carmack/i);
            const emailDisplay = screen.getByText(/email@email.com/i);
            const messageDisplay = screen.queryByTestId('messageDisplay');

            expect(firstnameDisplay).toBeInTheDocument();
            expect(lastnameDisplay).toBeInTheDocument();
            expect(emailDisplay).toBeInTheDocument();
            expect(messageDisplay).not.toBeInTheDocument();
        })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
        const firstName = screen.getByLabelText(/first name*/i);
        userEvent.type(firstName, "Nicholas");

        const lastName = screen.getByLabelText(/last name*/i);
        userEvent.type(lastName, "Carmack");

        const email = screen.getByLabelText(/email*/i);
        userEvent.type(email, 'email@email.com');

        const message = screen.getByLabelText(/message*/i);
        userEvent.type(email, 'this is a message');

        const submit = screen.getByRole('button');
        userEvent.click(submit);

        await waitFor(()=> {
            const firstnameDisplay = screen.getByText(/Nicholas/i);
            const lastnameDisplay = screen.getByText(/Carmack/i);
            const emailDisplay = screen.getByText(/email@email.com/i);
            const messageDisplay = screen.getByText(/this is a message/i);

            expect(firstnameDisplay).toBeInTheDocument();
            expect(lastnameDisplay).toBeInTheDocument();
            expect(emailDisplay).toBeInTheDocument();
            expect(messageDisplay).toBeInTheDocument();
        })
});
