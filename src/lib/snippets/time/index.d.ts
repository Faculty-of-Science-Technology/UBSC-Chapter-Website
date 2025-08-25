export interface IJobPopulated {
	Jobs: {
		CreatedAt: Date;
		Id: string;
		Title: string;
		MinRate: number;
		MaxRate: number;
		Description: string;
		JobTypeId: number | null;
		Draft: boolean;
		UserId: string | null;
	};
	Users: {
		CreatedAt: string;
		Id: string;
		AccountType: 'org' | 'student' | 'owner';
		FirstName: string;
		LastName: string;
		Email: string;
		Password: string;
		ActivationCode: string | null;
		Bio: string | null;
		Hireable: boolean;
	} | null;
	JobTypes: {
		CreatedAt: Date;
		Id: number;
		Name: string;
	} | null;
}

export function posted_relative_time(job: IJobPopulated);
