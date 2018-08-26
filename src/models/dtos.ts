//----------------< Users >-------------------//
export interface Login {
    googleId: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    email: string;
}
export interface LoginResponse {
    token: string;
    defalutPage?: number;
}
export interface PermissionRequest {
    userEmail: string;
    type: PermissionType;
}
export enum PermissionType {
    OWNER, VIEW, READ, NONE
}

//----------------< Entry >-------------------//
export interface ListEntriesIn {
    maxResult: number;
    pageNumber: number;
}
// deprecated
export interface ListEntriesOutItem {
    id: number;
    creator: string;
    amount: number;
    creationDate: string;
    class?: string
}

export interface ViewEntryOut {
    id: number;
    creator: string;
    amount: number;
    creationDate: string;
    members: MemberItem[];
    class?: string
}
export interface MemberItem {
    id: number;
    amount: number;
    index?: string;
}
export interface AddEntryIn {
    creditorId: number;
    amount: number;
    creationDate: string;
    members: number[];
}

//----------------< Sheets >-------------------//
export interface SheetListItem {
    id: number;
    name: string;
    creationDate: string;
    notes?: string;
}
export interface AddSheetIn {
    name: string;
    notes?: string;
}
export interface AddSheetOut {
    id: number;
}
export interface PermissionItem {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    email: string;
    permission: string;
}
export interface ViewSheetOut {
    id: number;
    name: string;
    creationDate: string;
    notes?: string;
    permissionsList: PermissionItem[];
}
export interface ReportOut {
    id: number;
    members: string[];
    balances: number[];
    total: number;
    isThereData?: boolean;
}

//----------------< Members >-------------------//

export interface ListMemberItem {
    id: number;
    name: string;
    userInfo?: UserItem;
}
export interface AddMemberIn {
    name: string;
    userId?: number;
}
export interface AddMemberOut {
    id: number;
    name: string;
    imageUrl?: string;
}

export interface ViewMemberOut {
    memberInfo: ListMemberItem[];
    balance: number;
    entries: EntryItem[];
}
export interface EntryItem {
    id: number;
    name: string;
    amount: number;
}
export interface UserItem {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    email: string;
}


export interface AllDto{
    entries:ViewEntryOut[]
    sheet:ViewSheetOut
    members:ListMemberItem[]
    report:ReportOut
    userSheets:SheetListItem[]
}