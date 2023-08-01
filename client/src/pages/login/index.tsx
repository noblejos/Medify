import { BaseUrl } from '@/config/baseUrl';
import User from '@/store/user.store';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    rem,
    Alert,
    LoadingOverlay
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';

const Login = async (data: LoginForm) => {
    console.log(data)
    const { data: response } = await axios.post(`${BaseUrl}/auth/login`, data);
    return response.data;
};

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z
        .string({
            required_error: "Password is required",
        })
        .refine(
            (value) =>
                /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
                    value,
                ),
            `Password must contain at least 8 characters, 
    include at least one uppercase letter, 
    one lowercase letter, a number, and one special character`,
        ),
})
export type LoginForm = z.infer<typeof loginSchema>

const loginForm = {
    email: "",
    password: "",
}

export default function AuthenticationTitle() {
    const { user, setUser } = User()

    const queryClient = useQueryClient()
    const router = useRouter()

    const [errorStr, setErrorStr] = useState("")

    const form = useForm<LoginForm>({
        initialValues: loginForm,
        validate: zodResolver(loginSchema),
    });
    const { mutate, isLoading, isError, error } = useMutation(Login, {
        onSuccess: data => {
            console.log(data);

            setCookie('auth', data.token, { maxAge: 60 * 6 * 24 });
            setUser({ ...data.user, token: data.token });
            router.push("/");
        },
        onError: (error) => {

            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                return setErrorStr(error?.response?.data.message);
            }
            console.log({ error })
            setErrorStr("Something went wrong while processing your request");
        },
        onSettled: () => {
            queryClient.invalidateQueries();
        }
    });


    const handleChange = (fieldName: keyof LoginForm, value: string | number) => {
        const updatedObject = { ...form.values, [fieldName]: value };
        form.setValues(updatedObject);
    };

    const handleSubmit = async () => {
        form.validate()
        const { errors, values } = form;
        console.log({ error: errors, values: values })
        if (Object.keys(errors).length) return;
        mutate(values)
    }
    return (
        <Container size={520} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome back!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="a" href='/register'>
                    Create account
                </Anchor>
            </Text>
            {isError && (
                <Alert
                    icon={<IconAlertCircle size="1rem" />}
                    title="An error occurred!"
                    color="red"
                    mb={30}
                    withCloseButton
                    closeButtonLabel="Close alert"
                    onClose={() => setErrorStr("")}
                >
                    {errorStr}
                </Alert>
            )}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <LoadingOverlay visible={isLoading} />
                <TextInput label="Email" placeholder="you@gmail.com" required
                    value={form.values.email}
                    onChange={(event) =>
                        handleChange("email", event.currentTarget.value)
                    }
                    error={form.errors.email} />
                <PasswordInput label="Password" placeholder="Your password" required mt="md"
                    value={form.values.password}
                    onChange={(event) =>
                        handleChange("password", event.currentTarget.value)
                    }
                    error={form.errors.password} />
                <Group position="apart" mt="lg">
                    <Checkbox label="Remember me" />
                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" onClick={() => handleSubmit()}>
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}