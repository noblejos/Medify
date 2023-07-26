import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
    Select,
} from '@mantine/core';
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod"

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: rem(900),
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },

    form: {
        borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
            }`,
        minHeight: rem(900),
        maxWidth: rem(550),
        paddingTop: rem(80),

        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

const registerSchema = z.object({
    firstName: z.string().nonempty().min(4, { message: "First Name must be at least 4 character(s)" }),
    lastName: z.string().nonempty().min(4, { message: "First Name must be at least 4 character(s)" }),
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 character(s)" }),
})
export type RegisterForm = z.infer<typeof registerSchema>

const registerForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: ""
}

const data = [{ value: "male", label: "Male" }, { label: "female", value: "Female" }]

export default function Register() {
    const { classes } = useStyles();

    const bankForm = useForm({
        initialValues: registerForm,
        validate: zodResolver(registerSchema),
    });

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    Welcome to Medify!
                </Title>
                <TextInput label="First Name" placeholder="Enter First Name" mt="md" size="md" />
                <TextInput label="Last Name" placeholder="Enter Last Name" mt="md" size="md" />
                <TextInput label="Email address" placeholder="hello@gmail.com" mt="md" size="md" />
                <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
                <Select
                    label="Gender"
                    placeholder="Enter Bank Name"
                    searchable
                    mb={"lg"}
                    size='md'
                    mt="md"
                    searchValue={bankForm.values.gender}
                    nothingFound="No options"
                    data={data}
                    onSearchChange={(event) =>
                        bankForm.setFieldValue("gender", event!)
                    }
                    defaultValue={bankForm.values.gender}
                />

                <Checkbox label="Keep me logged in" mt="xl" size="md" />

                <Button fullWidth mt="xl" size="md">
                    Login
                </Button>

                <Text ta="center" mt="md">
                    Already have an account?{' '}
                    <Anchor<'a'> href="/login" component='a' weight={700} >
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </div >
    );
}