'use client';

import useUpdateUser, {
	UpdateUserVariables,
} from '@/hooks/mutation/useUpdateUser';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UploadImage from '../settings/UploadImage/UploadImage';
import Label from '../ui/Label/Label';
import TextField from '../ui/TextField/TextField';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

interface SettingsViewProps {
	user: User;
}

const settingsSchema = z.object({
	name: z.string().min(3),
	displayName: z.string().max(30).nullable(),
	about: z.string().max(200).nullable(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const SettingsView = ({ user }: SettingsViewProps) => {
	const { register, handleSubmit, watch, getValues, getFieldState, reset } =
		useForm<SettingsValues>({
			defaultValues: user,
			resolver: zodResolver(settingsSchema),
		});
	const [updateUser] = useUpdateUser({
		onCompleted(data) {
			toast.success('Updated successfully');
			reset(data.updateUser);
		},
	});

	const nameRemaining = 30 - watch('name').length;
	const displayNameRemaining = 30 - (watch('displayName')?.length ?? 0);
	const aboutRemaining = 200 - (watch('about')?.length ?? 0);

	const onUpdate = (key: keyof SettingsValues) => {
		if (!getFieldState(key).isDirty || getFieldState(key).error) {
			return;
		}

		handleSubmit((values) => {
			const variables = { [key]: values[key] } as UpdateUserVariables;

			updateUser({
				variables,
			});
		})();
	};

	return (
		<div className="max-w-7xl m-auto px-4 py-6">
			<div className="font-medium text-lg border-b-2 border-input pb-2 mb-4 lg:mb-12">
				User settings
			</div>
			<div className="max-w-2xl mr-auto flex flex-col gap-4 lg:gap-6">
				<div className="flex flex-col gap-1">
					<Label>Name</Label>
					<TextField
						register={register('name', {
							onBlur() {
								onUpdate('name');
							},
						})}
						maxLength={30}
						remaining={nameRemaining}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>Display name</Label>
					<TextField
						register={register('displayName', {
							onBlur() {
								onUpdate('displayName');
							},
						})}
						placeholder="Display name"
						maxLength={30}
						remaining={displayNameRemaining}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label>About</Label>
					<TextField
						register={register('about', {
							onBlur() {
								onUpdate('about');
							},
						})}
						placeholder="About"
						maxLength={200}
						remaining={aboutRemaining}
					/>
				</div>
				<UploadImage image={user.image} />
			</div>
		</div>
	);
};

export default SettingsView;
