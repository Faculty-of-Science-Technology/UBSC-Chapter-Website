<script lang="ts">
	import { Badge } from '$lib/components/vendor/ui/badge/index.js';
	import { Button } from '$lib/components/vendor/ui/button/index.js';
	import * as Card from '$lib/components/vendor/ui/card/index.js';
	import * as Table from '$lib/components/vendor/ui/table/index.js';
	import { ArrowUpRight } from 'lucide-svelte';
</script>

<section>
	<section class="header text-archivo flex flex-col space-y-1 pb-8">
		<h1 class="text-5xl font-extralight lg:text-6xl">Manage Groups</h1>
		<p class="text-lg lg:text-2xl">Manage intern groups on the platform</p>
	</section>
	<Card.Root class="xl:col-span-2">
		<Card.Header class="flex flex-row items-center">
			<div class="grid gap-2">
				<Card.Title>Platform groups</Card.Title>
				<Card.Description>
					This is what will be shown in the <a href="/directory" class="text-foreground underline">intern directory</a> page
				</Card.Description>
			</div>
			<Button href="##" size="sm" class="ml-auto gap-1">
				View All
				<ArrowUpRight class="h-4 w-4" />
			</Button>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Customer</Table.Head>
						<Table.Head class="xl:table.-column hidden">Type</Table.Head>
						<Table.Head class="xl:table.-column hidden">Status</Table.Head>
						<Table.Head class="xl:table.-column hidden">Date</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">Liam Johnson</div>
							<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">
							<Badge class="text-xs" variant="outline">Approved</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
							2023-06-23
						</Table.Cell>
						<Table.Cell class="text-right">$250.00</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">Olivia Smith</div>
							<div class="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">Refund</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">
							<Badge class="text-xs" variant="outline">Declined</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
							2023-06-24
						</Table.Cell>
						<Table.Cell class="text-right">$150.00</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">Noah Williams</div>
							<div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">Subscription</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">
							<Badge class="text-xs" variant="outline">Approved</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
							2023-06-25
						</Table.Cell>
						<Table.Cell class="text-right">$350.00</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">Emma Brown</div>
							<div class="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">
							<Badge class="text-xs" variant="outline">Approved</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
							2023-06-26
						</Table.Cell>
						<Table.Cell class="text-right">$450.00</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<div class="font-medium">Liam Johnson</div>
							<div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
						</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">Sale</Table.Cell>
						<Table.Cell class="xl:table.-column hidden">
							<Badge class="text-xs" variant="outline">Approved</Badge>
						</Table.Cell>
						<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
							2023-06-27
						</Table.Cell>
						<Table.Cell class="text-right">$550.00</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</section>
