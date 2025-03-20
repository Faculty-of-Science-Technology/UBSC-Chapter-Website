<script lang="ts">
    import { Button } from '$lib/components/vendor/ui/button';
    import * as Dialog from '$lib/components/vendor/ui/dialog';
    import { Input } from '$lib/components/vendor/ui/input';
    import { Label } from '$lib/components/vendor/ui/label';
    import * as Select from '$lib/components/vendor/ui/select';
    import * as Sheet from '$lib/components/vendor/ui/sheet';
    import * as Table from '$lib/components/vendor/ui/table';
    import { Plus, Trash2, UserPlus, Users } from 'lucide-svelte';
    import SuperDebug, { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';

    export let data: PageData;
    const { form, enhance, errors } = superForm(data.form);

    let selectedGroup: typeof data.groups[0] | null = null;
    let showMembersSheet = false;
</script>
<SuperDebug data={form} />
<div class="container mx-auto py-10">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h2 class="text-3xl font-bold">Manage Groups</h2>
            <p class="text-muted-foreground">For agenda: {data.agenda.Title}</p>
        </div>
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>
                    <Plus class="mr-2 h-4 w-4" />
                    Create Group
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Create New Group</Dialog.Title>
                </Dialog.Header>
                <form method="POST" action="?/createGroup" class="grid gap-4 py-4" use:enhance>
                    <input type="hidden" name="agendaId" value={data.agenda.Id} />
                    <div class="grid gap-2">
                        <Label for="title">Group Name</Label>
                        <p class="text-sm text-red-500">{$errors.title}</p>
                        <Input name="title" bind:value={$form.title} placeholder="Team Alpha" />
                    </div>
                    <Dialog.Footer>
                        <Button type="submit">Create Group</Button>
                    </Dialog.Footer>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    </div>

    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Members</Table.Head>
                <Table.Head class="text-right">Actions</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each data.groups as group}
                <Table.Row>
                    <Table.Cell>{group.Title}</Table.Cell>
                    <Table.Cell>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onclick={() => {
                                selectedGroup = group;
                                showMembersSheet = true;
                            }}
                        >
                            <Users class="mr-2 h-4 w-4" />
                            {group.members?.length || 0} members
                        </Button>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                        <div class="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onclick={() => {
                                selectedGroup = group;
                                showMembersSheet = true;
                            }}>
                                <UserPlus class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>

<Sheet.Root bind:open={showMembersSheet}>
    <Sheet.Content side="right" class="w-[400px]">
        <Sheet.Header>
            <Sheet.Title>Manage Members</Sheet.Title>
            <Sheet.Description>
                Add or remove members from {selectedGroup?.Title}
            </Sheet.Description>
        </Sheet.Header>

        <div class="py-4">
            <form method="POST" action="?/addMember" class="flex gap-2 mb-4">
                <input type="hidden" name="groupId" value={selectedGroup?.Id} />
                <Select.Root name="userId">
                    <Select.Trigger class="w-full">
                        <Select.Item placeholder="Select a user" />
                    </Select.Trigger>
                    <Select.Content>
                        {#each data.availableUsers as user}
                            <Select.Item value={user.Id}>
                                {user.FirstName} {user.LastName}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
                <Button type="submit">Add</Button>
            </form>

            <div class="space-y-4">
                {#if selectedGroup?.members?.length}
                    {#each selectedGroup.members as member}
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-medium">{member.user.FirstName} {member.user.LastName}</p>
                                <p class="text-sm text-muted-foreground">{member.user.Email}</p>
                            </div>
                            <form method="POST" action="?/removeMember">
                                <input type="hidden" name="groupId" value={selectedGroup.Id} />
                                <input type="hidden" name="userId" value={member.user.Id} />
                                <Button variant="ghost" size="icon" type="submit">
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    {/each}
                {:else}
                    <p class="text-muted-foreground">No members in this group yet.</p>
                {/if}
            </div>
        </div>
    </Sheet.Content>
</Sheet.Root>
