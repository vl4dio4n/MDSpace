--
-- Data for Name: Groups; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."Groups" VALUES (1, 'Grup 1', 'Grup cu vl4dio4n, user1 si user2');
INSERT INTO public."Groups" VALUES (3, NULL, 'Private chat vl4dio4n - user1');
INSERT INTO public."Groups" VALUES (4, NULL, 'Private chat vl4dio4n - user2');
INSERT INTO public."Groups" VALUES (5, NULL, 'Private chat vl4dio4n - user3');
INSERT INTO public."Groups" VALUES (6, NULL, 'Private chat vl4dio4n - user4');
INSERT INTO public."Groups" VALUES (7, NULL, 'Private chat vl4dio4n - user5');
INSERT INTO public."Groups" VALUES (8, NULL, 'Private chat vl4dio4n - user6');
INSERT INTO public."Groups" VALUES (9, NULL, 'Private chat vl4dio4n - user7');
INSERT INTO public."Groups" VALUES (10, NULL, 'Private chat vl4dio4n - user8');
INSERT INTO public."Groups" VALUES (2, 'Grup 2', 'Nulla lobortis aliquet nunc, eu hendrerit lectus rutrum sit amet. Praesent nulla est, porta at tempus ac, rutrum ac arcu. Mauris et quam vel risus ultricies interdum non eget lacus. Vivamus sit amet neque mollis, porttitor sapien non, placerat felis. Sed elementum, metus eu semper sollicitudin, risus mauris pretium enim, id vehicula ante leo ut ipsum. Pellentesque volutpat fringilla efficitur. Etiam luctus purus posuere, tincidunt sapien at, commodo risus. Suspendisse luctus, mauris vel condimentum suscipit, odio diam ultrices nunc, vitae suscipit ligula leo non nunc. Donec odio sapien, mattis pretium facilisis vel, volutpat sed ex. Mauris sed aliquet libero. Praesent egestas semper porta. Nunc ullamcorper malesuada odio id consequat.');


--
-- Data for Name: LastActivities; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."LastActivities" VALUES (1, 7, '2023-04-15 11:06:23.078497+03');
INSERT INTO public."LastActivities" VALUES (1, 6, '2023-04-20 11:06:56.778149+03');


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."Messages" VALUES (1, 3, 7, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mattis rutrum tellus at pretium. Nam porta ipsum ut nisl vulputate, at gravida nunc efficitur.', '2023-04-19 15:45:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (2, 3, 7, 2, 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae', '2023-04-19 15:46:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (3, 3, 7, 1, 'Suspendisse condimentum metus id varius tincidunt', '2023-04-19 15:47:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (4, 3, 7, 2, 'Quisque finibus aliquet ex, nec condimentum elit tempus a. In iaculis sem vitae congue porta', '2023-04-19 15:48:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (5, 3, 7, 2, 'Nam fermentum erat et lectus tempus, eget auctor nisl tincidunt', '2023-04-19 15:49:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (6, 3, 7, 1, 'Nullam ornare eros vitae nisi accumsan, sed condimentum sem accumsan.', '2023-04-19 15:50:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (7, 3, 7, 1, 'Nam dictum, nisl posuere dictum scelerisque, est ante auctor augue, sed vulputate arcu arcu elementum felis. Nullam euismod sagittis vulputate. Quisque varius feugiat erat, feugiat semper nibh blandit fringilla', '2023-04-19 15:51:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (8, 3, 7, 2, 'Phasellus congue elementum cursus. Vivamus maximus pellentesque augue, at sollicitudin arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis non euismod nulla.', '2023-04-19 15:52:31.882907+03', 'text');
INSERT INTO public."Messages" VALUES (9, 3, 7, 2, 'Etiam sit amet facilisis erat. Ut semper tortor in volutpat posuere', '2023-04-21 12:10:44.320896+03', 'text');
INSERT INTO public."Messages" VALUES (10, 3, 7, 2, 'Mauris pulvinar eu massa sollicitudin rutrum. Maecenas ultricies odio non lacus sodales, id euismod sem facilisis', '2023-04-21 12:10:48.854048+03', 'text');
INSERT INTO public."Messages" VALUES (11, 3, 7, 2, 'Donec in nunc tempus, lacinia nulla non, rhoncus odio. Integer aliquam metus quis euismod faucibus. In massa augue,', '2023-04-21 12:10:52.58515+03', 'text');
INSERT INTO public."Messages" VALUES (12, 3, 7, 1, 'Phasellus vitae leo pulvinar, ullamcorper nibh a, suscipit urna. Vestibulum pulvinar urna tellus, pretium dictum eros volutpat id.', '2023-04-21 12:10:57.086064+03', 'text');
INSERT INTO public."Messages" VALUES (13, 3, 7, 1, ' Integer ornare pharetra erat, eu lacinia turpis euismod at', '2023-04-21 12:11:01.229346+03', 'text');
INSERT INTO public."Messages" VALUES (14, 3, 7, 2, 'Donec imperdiet tincidunt accumsan. Pellentesque at odio scelerisque, bibendum elit sit amet, efficitur dolor.', '2023-04-21 12:11:04.725422+03', 'text');


--
-- Data for Name: Threads; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."Threads" VALUES (1, 1, 'general');
INSERT INTO public."Threads" VALUES (2, 1, 'Group 1 Thread 1');
INSERT INTO public."Threads" VALUES (3, 1, 'Group 1 Thread 2');
INSERT INTO public."Threads" VALUES (4, 2, 'general');
INSERT INTO public."Threads" VALUES (5, 2, 'Group 2 Thread 1');
INSERT INTO public."Threads" VALUES (6, 2, 'Group 2 Thread 2');
INSERT INTO public."Threads" VALUES (7, 3, 'general');
INSERT INTO public."Threads" VALUES (8, 3, 'Group 3 Thread 1');
INSERT INTO public."Threads" VALUES (9, 3, 'Group 3 Thread 2');
INSERT INTO public."Threads" VALUES (10, 4, 'general');
INSERT INTO public."Threads" VALUES (11, 4, 'Group 4 Thread 1');
INSERT INTO public."Threads" VALUES (12, 4, 'Group 4 Thread 2');


--
-- Data for Name: UserGroups; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."UserGroups" VALUES (1, 1, 'admin');
INSERT INTO public."UserGroups" VALUES (1, 2, 'admin');
INSERT INTO public."UserGroups" VALUES (1, 3, 'member');
INSERT INTO public."UserGroups" VALUES (1, 4, 'member');
INSERT INTO public."UserGroups" VALUES (2, 1, 'member');
INSERT INTO public."UserGroups" VALUES (2, 2, 'member');
INSERT INTO public."UserGroups" VALUES (2, 3, 'member');
INSERT INTO public."UserGroups" VALUES (3, 1, 'admin');
INSERT INTO public."UserGroups" VALUES (3, 2, 'member');
INSERT INTO public."UserGroups" VALUES (3, 4, 'member');
INSERT INTO public."UserGroups" VALUES (1, 5, 'member');
INSERT INTO public."UserGroups" VALUES (1, 6, 'member');
INSERT INTO public."UserGroups" VALUES (1, 7, 'member');
INSERT INTO public."UserGroups" VALUES (1, 8, 'member');
INSERT INTO public."UserGroups" VALUES (1, 9, 'member');
INSERT INTO public."UserGroups" VALUES (1, 10, 'member');
INSERT INTO public."UserGroups" VALUES (4, 5, 'member');
INSERT INTO public."UserGroups" VALUES (5, 6, 'member');
INSERT INTO public."UserGroups" VALUES (6, 7, 'member');
INSERT INTO public."UserGroups" VALUES (7, 8, 'member');
INSERT INTO public."UserGroups" VALUES (8, 9, 'member');
INSERT INTO public."UserGroups" VALUES (9, 10, 'member');


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: vl4dio4n
--

INSERT INTO public."Users" VALUES (2, 'user1', 'user1@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'salut, sunt user 1');
INSERT INTO public."Users" VALUES (3, 'user2', 'user2@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'salut, sunt user 2');
INSERT INTO public."Users" VALUES (4, 'user3', 'user3@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'user 3 e aici');
INSERT INTO public."Users" VALUES (5, 'user4', 'user4@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'user 4 a venit');
INSERT INTO public."Users" VALUES (6, 'user5', 'user5@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'user 5 prezent la datorie');
INSERT INTO public."Users" VALUES (7, 'user6', 'user6@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'salut lume');
INSERT INTO public."Users" VALUES (8, 'user7', 'user7@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'alt user...');
INSERT INTO public."Users" VALUES (9, 'user8', 'user8@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'ultimul user');
INSERT INTO public."Users" VALUES (1, 'vl4dio4n', 'vladioanbirsan1@gmail.com', '190f5f27f2c77acac2199bec21870e75c2b9b894ac5d85b81f9738aadc86947559aab7bb48cee79a445e11995e90be73adb6ad3a6bd50046a0d8d7f9a128c1b1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempus dui quis mattis consequat. Morbi fringilla libero neque, vitae hendrerit lacus rhoncus id. Nunc dignissim et odio ornare cursus. In hac habitasse platea dictumst. Fusce lacinia mi eget enim dapibus, et rutrum ligula ultrices. In vulputate molestie ultrices. In et nisi sed quam porta pharetra. Nulla diam dolor, porta at purus vitae, fringilla euismod felis. Nulla ultricies sed massa in facilisis. Aenean et tincidunt arcu. Maecenas venenatis tortor at commodo dignissim. Mauris dolor nibh, fermentum ut felis sit amet, eleifend bibendum neque. Nullam non eleifend justo, vitae commodo velit. Curabitur pulvinar viverra diam et vestibulum. Nullam a est sit amet libero cursus aliquet non non lacus. Nulla vitae pulvinar est, sed consequat mauris. Vestibulum ac odio dapibus, consectetur felis non, blandit dolor. Ut consectetur sodales eros, a efficitur felis. Nulla sed lacus auctor, ultrices justo quis, rutrum tellus. Morbi hendrerit, leo id molestie finibus, elit mi ultricies risus, ac pretium nisl ipsum ac mauris. Morbi blandit lacinia neque non feugiat. Integer pharetra, dui ac hendrerit venenatis, orci tortor euismod arcu, sed consectetur magna ex id nibh. Sed pretium feugiat dolor et bibendum. Mauris nec est interdum, auctor risus eu, lobortis nunc.');


