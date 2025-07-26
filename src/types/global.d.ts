export {};

	declare global {
	interface IBackendRes<T> {
    	error?: string | string[];
    	message: string;
    	statusCode: number | string;
    	data?: T;
	}

    	interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    	}
	interface ILogin {
	    access_token: string;
	    user: {
			email: string;
			phone: string;
			fullName: string;
			role: string;
			avatar: string;
			id: string;
			}
		}

	interface IRegister {
			_id: string,
			email: string,
			fullName: string,
		}

	interface IUser {
			id: string,
            email: string,
            phone: string,
            fullName: string,
            role: string,
            avatar: string,
		}

	interface IFetch {
		user: IUser
	}

	interface IUserTable {
			_id: string,
			fullName: string,
			email: string,
			phone: string,
			role: string,
			avatar: string,
			isActive: boolean,
			type: string,
			createdAt: Date,
			updatedAt: Date
	}

	interface IResponseImport {
		countSuccess: number,
        countError: number,
		detail: any
	}
}