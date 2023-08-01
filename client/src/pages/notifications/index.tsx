import { Tabs, Card, Text, Flex } from '@mantine/core';


import withLayout from "@/layout/appLayout"
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { BaseUrl } from '@/config/baseUrl';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Notification {
    header: string,
    message: string,
    status: string,
    role: string,
    user: string,
    clickPath: string
}

function Notification() {


    const queryClient = useQueryClient()

    const token = getCookie("auth")

    const fetchNotifications = async () => {
        const { data: response } = await axios.get(`${BaseUrl}/notifications`, {
            headers: {
                Authorization: "Bearer " + `${token}`,
            }
        });
        return response.data;
    }
    const { isLoading, isError, data: notifications, error } = useQuery(["notifications"], fetchNotifications)
    console.log({ notifications })
    let seen;
    let unSeen;

    if (notifications) {
        seen = notifications?.filter((notification: Notification) => notification.status === "seen")
        console.log({ seen })
        unSeen = notifications?.filter((notification: Notification) => notification.status === "unseen")
        console.log({ unSeen })
    }


    return (
        <div>
            <Tabs keepMounted={false} defaultValue="unseen">
                <Tabs.List>
                    <Tabs.Tab value="unseen">Unseen</Tabs.Tab>
                    <Tabs.Tab value="seen">Seen</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="unseen">
                    {unSeen?.map((item: Notification, index: number) => (

                        <Card key={index}>
                            <Flex>
                                <Text c="black">{item.message}</Text>
                            </Flex>

                        </Card>
                    ))}
                </Tabs.Panel>
                <Tabs.Panel value="seen">Second panel</Tabs.Panel>
            </Tabs>
        </div>
    )
}
export default withLayout(Notification, "Notification")