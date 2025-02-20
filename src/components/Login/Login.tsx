import { useForm } from "@mantine/form";
import { GenericTopBar } from "@/components/TopBars"
import { ActionIcon, Button, Checkbox, Group, PasswordInput, Stack, Tabs, TextInput, Title, Tooltip } from "@mantine/core";
import { IconPlus, IconSpy, IconUser, IconWorldBolt } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
    const { signInWithEmail, signUpWithEmail, signInAnonymously } = useAuth();
    const loginForm = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '' },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Name must have at least 6 letters' : null),
        },
    });
    const registerForm = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '', passwordConfirm: '', terms: false },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Name must have at least 6 letters' : null),
            passwordConfirm: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
            terms: (value) => (value ? null : 'You must accept terms and conditions'),
        },
    });

    //signin functions trigger a loading state which hides this page. no need to handle loading state here.
    const handleLoginFormSubmit = (values: typeof loginForm.values) => {
        signInWithEmail(values.email, values.password);
    }

    const handleRegisterFormSubmit = (values: typeof registerForm.values) => {
        signUpWithEmail(values.email, values.password);
    }

    const handleSignInAnonymously = () => {
        signInAnonymously();
    }

    const handleTabChange = () => {
        loginForm.clearErrors();
        registerForm.clearErrors();
    }


    return (
        <>
            <GenericTopBar title="Login" />

            <Stack
                w={"100%"}
                h={"100%"}
                align="center"
                justify="center"
                gap={"md"}
                p={"md"}
            >
                <IconWorldBolt className="animate-pulse animate-infinite animate-ease-in-out" size={50} />
                <Title style={{
                    textShadow: "0 0 3em var(--mantine-primary-color-5)",
                    color: "var(--mantine-primary-color-5)",
                }}>ViteNote</Title>

            </Stack>

            <Tabs variant="outline" radius="md" defaultValue="login" onChange={handleTabChange}>
                <Tabs.List grow justify="center">
                    <Tabs.Tab value="login" leftSection={<IconUser size={14} />}>
                        Login
                    </Tabs.Tab>
                    <Tabs.Tab value="register" leftSection={<IconPlus size={14} />}>
                        New User
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login">
                    <form onSubmit={loginForm.onSubmit(handleLoginFormSubmit)}>
                        <Stack
                            w={"100%"}
                            align="stretch"
                            justify="center"
                            gap={"sm"}
                            p={"sm"}
                        >
                            <TextInput
                                label="Email"
                                placeholder="example@gmail.com"
                                key={loginForm.key('email')}
                                {...loginForm.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="***"
                                key={loginForm.key('password')}
                                {...loginForm.getInputProps('password')}
                            />
                            <Button type="submit" mt={"md"}>
                                Continue
                            </Button>
                        </Stack>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="register">
                    <form onSubmit={registerForm.onSubmit(handleRegisterFormSubmit)}>
                        <Stack
                            w={"100%"}
                            align="stretch"
                            justify="center"
                            gap={"sm"}
                            p={"sm"}
                        >
                            <TextInput
                                label="Email"
                                placeholder="example@gmail.com"
                                key={registerForm.key('email')}
                                {...registerForm.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="***"
                                key={registerForm.key('password')}
                                {...registerForm.getInputProps('password')}
                            />
                            <PasswordInput
                                label="Password Confirm"
                                placeholder="***"
                                key={registerForm.key('passwordConfirm')}
                                {...registerForm.getInputProps('passwordConfirm')}
                            />
                            <Checkbox
                                label="I accept terms and conditions"
                                key={registerForm.key('terms')}
                                {...registerForm.getInputProps('terms')}
                            />
                            <Button type="submit" mt={"md"}>
                                Continue
                            </Button>
                        </Stack>
                    </form>
                </Tabs.Panel>
            </Tabs>
            <Group
                w={"100%"}
                align="center"
                justify="center"
                gap={"md"}
                p={"md"}
            >
                <Tooltip label="Sign in anonymously">
                    <ActionIcon variant="default" size={"input-sm"} onClick={handleSignInAnonymously}>
                        <IconSpy />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </>
    )
}

export default Login